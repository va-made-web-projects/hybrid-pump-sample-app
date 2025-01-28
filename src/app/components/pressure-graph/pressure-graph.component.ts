import { DeviceSettingsService } from 'src/app/services/device-settings.service';
import { ConversionsService } from 'src/app/services/conversions.service';
import { Input, OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Chart, ChartOptions, registerables, Plugin } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { Subscription } from 'rxjs';
import { BluetoothService } from 'src/app/services/bluetooth.service';
import  ChartAnnotation from 'chartjs-plugin-annotation';


@Component({
  selector: 'app-pressure-graph',
  templateUrl: './pressure-graph.component.html',
  styleUrls: ['./pressure-graph.component.scss'],
})
export class PressureGraphComponent  implements OnInit, OnDestroy {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  currentPressureReading: number = 0;

  upper = this.deviceSettingsService.select('upperThresh');
  lower = this.deviceSettingsService.select('lowerThresh');

  lineChartType: ChartType = 'line';
  lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Pressure',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: [],
  };

  options: ChartOptions = {

  };
  plugins: any = [

  ]
  constructor(private bluetoothService: BluetoothService, private deviceSettingsService: DeviceSettingsService) {
    Chart.register(...registerables, ChartAnnotation);

  }
  ngOnDestroy(): void {
  }

  ngOnInit() {
    this.options= {
      plugins: {
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: this.lower,
              yMax: this.lower,
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 2,
              borderDash: [5, 5],
            },
            line2: {
              type: 'line',
              yMin: this.upper,
              yMax: this.upper,
              borderColor: 'rgb(132, 255, 99)',
              borderWidth: 2,
              borderDash: [5, 5],
            }
          }
        }
    },
      elements: {
        line: {
          tension: 0.5,
        },
      },
      scales: {
        // We use this empty structure as a placeholder for dynamic theming.
        y: {
          position: 'left',
        },
      },
    };

    let count = 0;
    setInterval(() => {
      // Generate a random number. Adjust the range as needed.
      // const randomNumber = Math.floor(Math.random() * 100);

      // Assuming you always want to add to the first dataset.
      if (this.lineChartData.datasets[0].data) {
        if (this.lineChartData.datasets[0].data.length >= 10) {
          // Remove the oldest element
          this.lineChartData.datasets[0].data.shift();
          this.lineChartData.labels?.shift();
        }
        this.lineChartData.datasets[0].data.push(this.bluetoothService.currentPressureSignal());
        this.lineChartData.labels?.push(count);
        count++
        if (this.chart && this.chart.chart) {
          this.chart.chart.update();
        }
      }
    }, 1000); // 1000 milliseconds = 1 second
  }

}


