import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // important : enregistrement des composants

const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit'
};

@Component({
  selector: 'app-forecast-chart',
  templateUrl: './forecast-chart.component.html',
  styleUrls: ['./forecast-chart.component.scss']
})
export class ForecastChartComponent implements AfterViewInit {
  @ViewChild('myChart', { static: false }) chartRef!: ElementRef<HTMLCanvasElement>;
  @Input() forecasts: any[] = []; // Input pour les prévisions, peut être utilisé pour personnaliser le graphique
  @Input() isTempOnly: boolean = false;
  chart!: Chart;

  ngAfterViewInit(): void {
    const res = this.forecasts.map(forecast => ({
      date: new Date(forecast.dt * 1000).toLocaleDateString('fr-FR', dateTimeFormatOptions),
      temp: forecast.main.temp,
      description: forecast.weather[0].description,
      humidity: forecast.main.humidity,
      windSpeed: forecast.wind.speed * 3.6 // Conversion de m/s à km/h
    }));

    this.chart = new Chart(this.chartRef.nativeElement, this.isTempOnly ? this.getTempOnlyData(res) : this.getFullData(res));
  }

  private getTempOnlyData(forecasts: any[]): any {
    return {
      data: {
        labels: forecasts.map(forecast => forecast.date),
        datasets: [
          {
            type: 'line',
            label: 'Température',
            data: forecasts.map(forecast => forecast.temp),
            fill: false,
            /* borderColor: 'rgba(54, 162, 235, 0.7)', */
            borderColor: forecasts.map(forecast => this.getHeatColor(forecast.temp, Math.min(...forecasts.map(forecast => forecast.temp)), Math.max(...forecasts.map(forecast => forecast.temp)))), // Couleur de fond basée sur la température
            backgroundColor: forecasts.map(forecast => this.getHeatColor(forecast.temp, Math.min(...forecasts.map(forecast => forecast.temp)), Math.max(...forecasts.map(forecast => forecast.temp)))), // Couleur de fond basée sur la température
            tension: 0.2,
            borderWidth: 1
          }
        ]
      },
      options: {
        layout: {
          padding: {
            top: 0,
            bottom: 0,
            left: 30,
            right: 70
          }
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: false // 👈 Cette ligne évite de forcer le zéro
          }
        },
        maintainAspectRatio: false, // 👈 pour que le graphique prenne toute la hauteur du conteneur
        plugins: {
          legend: {
            display: false
          }
        }
      },
    }
  }

  private getFullData(forecasts: any[]): any {
    return {
      data: {
        labels: forecasts.map(forecast => forecast.date),
        datasets: [
          {
            type: 'bar',
            label: 'Humidité',
            data: forecasts.map(forecast => forecast.humidity),
            borderColor: 'rgb(99, 174, 255)',
            backgroundColor: 'rgba(99, 174, 255, 0.2)',
            borderWidth: 1,
            order: 3
          },
          {
            type: 'line',
            label: 'Température',
            data: forecasts.map(forecast => forecast.temp),
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.2,
            order: 2
          },
          {
            type: 'line',
            label: 'Vent (km/h)',
            data: forecasts.map(forecast => forecast.windSpeed),
            tension: 0.2,
            order: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false // 👈 Cette ligne évite de forcer le zéro
          }
        },
        maintainAspectRatio: false, // 👈 pour que le graphique prenne toute la hauteur du conteneur
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true, // 👈 important
              pointStyle: 'circle', // 👈 définit le style
            }
          }
        }
      }
    }
  }

  private getHeatColor(value: number, min: number, max: number): string {
    // Normalise entre 0 et 1
    const t = (value - min) / (max - min);
  
    // Interpolation linéaire entre bleu (froid) et rouge (chaud)
    const r = Math.round(255 * t);
    const g = Math.round(150 * (1 - t));  // vert diminue
    const b = Math.round(255 * (1 - t));  // bleu diminue
  
    return `rgba(${r}, ${g}, ${b}, 0.9)`; // Retourne une couleur en rgba avec une opacité de 0.2
  }
}
