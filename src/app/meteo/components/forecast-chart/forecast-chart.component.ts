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

    this.chart = new Chart(
      this.chartRef.nativeElement,
      this.isTempOnly ? this.getTempOnlyData(res) : this.getFullData(res)
    );
  }

  private getTempOnlyData(forecasts: any[]): any {
    return {
      data: this.getData(forecasts),
      options: {
        layout: {
          padding: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        },
        responsive: true,
        scales: {
          y: {
            ticks: {
              display: false,
            },
            grid: {
              drawTicks: false,
            },
            beginAtZero: false // 👈 Cette ligne évite de forcer le zéro
          },
          x: {
            ticks: {
              display: false // ou true selon ce que tu veux afficher
            },
            grid: {
              drawOnChartArea: true
            }
          },

        },
        maintainAspectRatio: false, // 👈 pour que le graphique prenne toute la hauteur du conteneur
        plugins: {
          legend: {
            display: false
          }
        }
      },
      plugins: [
        {
          beforeDraw: (chart: Chart) => {
            this.generateLegendHTML(chart);
          }
        }
      ]
    };
  }

  private getData(forecasts: any[]): any {
    return {
      labels: forecasts.map(forecast => forecast.date),
      datasets: [
        {
          type: 'line',
          label: 'Température',
          data: forecasts.map(forecast => forecast.temp),
          fill: false,
          /* borderColor: 'rgba(54, 162, 235, 0.7)', */
          borderColor: forecasts.map(forecast =>
            this.getHeatColor(
              forecast.temp,
              Math.min(...forecasts.map(forecast => forecast.temp)),
              Math.max(...forecasts.map(forecast => forecast.temp))
            )
          ), // Couleur de fond basée sur la température
          backgroundColor: forecasts.map(forecast =>
            this.getHeatColor(
              forecast.temp,
              Math.min(...forecasts.map(forecast => forecast.temp)),
              Math.max(...forecasts.map(forecast => forecast.temp))
            )
          ),
          tension: 0.2,
          borderWidth: 1,
          order: 1,
          xAxisID: 'x'
        },
        {
          type: 'line',
          label: 'Vent (km/h)',
          data: forecasts.map(forecast => forecast.windSpeed),
          tension: 0.2,
          order: 2,
          xAxisID: 'x'
        },
        {
          type: 'bar',
          label: 'Humidité',
          data: forecasts.map(forecast => forecast.humidity),
          borderColor: 'rgb(99, 174, 255)',
          backgroundColor: 'rgba(99, 174, 255, 0.2)',
          borderWidth: 1,
          order: 3,
          xAxisID: 'x'
        }
      ]
    };
  }

  private getFullData(forecasts: any[]): any {
    return {
      data: this.getData(forecasts),
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
              pointStyle: 'circle' // 👈 définit le style
            }
          }
        }
      }
    };
  }

  private getHeatColor(value: number, min: number, max: number): string {
    // Normalise entre 0 et 1
    const t = (value - min) / (max - min);

    // Interpolation linéaire entre bleu (froid) et rouge (chaud)
    const r = Math.round(255 * t);
    const g = Math.round(150 * (1 - t)); // vert diminue
    const b = Math.round(255 * (1 - t)); // bleu diminue

    return `rgba(${r}, ${g}, ${b}, 0.9)`; // Retourne une couleur en rgba avec une opacité de 0.2
  }

  private generateDomElt(
    tagname: string,
    text: string,
    parentElt: HTMLElement,
    attributes?: { [key: string]: string }
  ): HTMLElement {
    const element = document.createElement(tagname);
    if (text) element.textContent = text;
    parentElt.appendChild(element);
    // Parcours d'un objet littéral avec for ... in
    for (let key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    return element;
  }

  private generateLegendHTML(chart: Chart): void {
    const legendContainer = document.getElementById('legend-container');
    let legend = legendContainer?.querySelector('legend') as HTMLLegendElement;
    if (!legend && legendContainer) {
      legend = this.generateDomElt('legend', '', legendContainer, { class: 'chart-legend' }) as HTMLLegendElement;
      legend.style.font = '12px sans-serif';

      chart.legend?.legendItems?.forEach((label: any, index: number) => {
        const row = this.generateDomElt('div', '', legend!, { class: 'chart-legend-row' });
        const puce = this.generateDomElt('div', '', row, { class: 'chart-legend-puce' });
        puce.style.backgroundColor = label.fillStyle;
        puce.style.border = '1px solid ' + label.strokeStyle;
        const text = this.generateDomElt('div', label.text, row, { class: 'chart-legend-text' });

        if (index === 1 || index === 2) {
          const meta = chart.getDatasetMeta(index);
          chart.getDatasetMeta(index).hidden = true;
          text.style.textDecorationLine = 'line-through';
          chart.update();
        }

        row.onclick = () => {
          const meta = chart.getDatasetMeta(index);
          meta.hidden = meta.hidden === null ? true : !meta.hidden;
          chart.update();
          text.style.textDecorationLine = !meta.hidden ? 'unset' : 'line-through';
        };

        legendContainer.style.width = '100%';
        legend.style.width = '100%';
        legend.style.display = 'flex';
        legend.style.justifyContent = 'center';
        legend.style.flexWrap = 'wrap';
        legend.style.padding = '12px 0';
      });
    }
  }
}
