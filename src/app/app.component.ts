import { Component, ElementRef, ViewChild, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartComponent } from 'chart.js';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, MatIconModule, MatSlideToggleModule, MatInputModule, MatGridListModule, MatButtonModule, MatCardModule, BaseChartDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  // @ViewChild('chart1', { static: false }) chart1?: BaseChartDirective;
  // @ViewChild('chart2', { static: false }) chart2?: BaseChartDirective;
  // @ViewChild('line-chart') chart1?: BaseChartDirective;
  // @ViewChild('line-chart2') chart2?: BaseChartDirective;
  // @ViewChildren('chart1', { read: ElementRef }) chart1?: ElementRef;
  // @ViewChild('chart1') chart1!: BaseChartDirective;
  // @ViewChild('chart2') chart2!: BaseChartDirective;

  // @ViewChild('chart1', { static: false }) chart1?: BaseChartDirective;
  // @ViewChild('chart2', { static: false }) chart2?: BaseChartDirective;
  urlImage = '../assets/images/img';
  imgURLFull = '';
  gravity = 9.8;
  time = 0;
  initialVelocity = 0;
  finalVelocity = 0;
  heightFall = 0;


  form: FormGroup;


  cfg = {
    data: {
      datasets: [
        {
          data: [] as number[],
          label: 'Velocidad/Tiempo',
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: 'rgba(75,192,192,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(75,192,192,1)',
          
          fill: 'origin',

        }],
      labels: [] as string[]
    },
    options: {
      responsive: true,

      // parsing: {
      //   xAxisKey: 'id',
      //   yAxisKey: 'nested.value'
      // }
    }
  }

  cfg2 = {
    data: {
      datasets: [
        {
          data: [] as number[],
          label: 'Posición/Tiempo',
          backgroundColor: 'rgba(153,102,255,0.2)',
          borderColor: 'rgba(153,102,255,1)',
          pointBackgroundColor: 'rgba(153,102,255,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(153,102,255,1)',
          
          
          fill: 'origin',

        }],
      labels: [] as string[]
    },
    options: {
      responsive: true,

      // parsing: {
      //   xAxisKey: 'id',
      //   yAxisKey: 'nested.value'
      // }
    }
  }


  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      gravedad: [''],
      tiempo: [''],
      altura: [''],
      velocidadInicial: [''],
      velocidadFinal: ['']
    });

  }


  height() {
    this.imgURLFull = this.urlImage + '4.jpg';
    this.form.get('altura')?.disable();
    this.form.get('velocidadFinal')?.disable();
  }

  timeVelocity() {
    this.imgURLFull = this.urlImage + '1.jpg';
  }

  heightFallTime() {
    this.imgURLFull = this.urlImage + '3.jpg';
  }


  onSubmit() {
    console.log(this.form.value);
    this.calculateHeight();

  }


  calculateHeight() {
    this.gravity = parseFloat(this.form.get('gravedad')?.value);
    this.time = parseFloat(this.form.get('tiempo')?.value);
    this.initialVelocity = parseFloat(this.form.get('velocidadInicial')?.value) || 0;

    if (!isNaN(this.gravity) && !isNaN(this.time)) {
      this.heightFall = this.initialVelocity * this.time + 0.5 * this.gravity * Math.pow(this.time, 2);
      this.form.get('altura')?.setValue(this.heightFall.toFixed(1));
      this.updateChart(this.gravity, this.time, this.initialVelocity, this.heightFall);
    } else {
      alert('Por favor, ingrese valores válidos para gravedad y tiempo.');
    }
  }

  updateChart(gravedad: number, tiempo: number, velocidadInicial: number, altura: number) {
    const times = [];
    const velocities: number[] = [];
    const heights: number[] = [];
    const positions: number[] = [];
    const step = 1; // Incremento de tiempo para una gráfica más suave

    for (let t = 0; t <= tiempo; t += step) {
      times.push(t.toFixed(0));
      velocities.push(parseFloat((velocidadInicial + gravedad * t).toFixed(2)));
      // position.push(((altura + velocidadInicial * t - 0.5 * gravedad + Math.pow(t, 2))));
      // heights.push(parseFloat((velocidadInicial * t + 0.5 * gravedad * Math.pow(t, 2)).toFixed(2)));
  
      // positions.push(parseFloat((velocidadInicial * t + 0.5 * gravedad * Math.pow(t, 2)).toFixed(2)));
      positions.push(parseFloat((altura - (velocidadInicial * t + 0.5 * gravedad * Math.pow(t, 2))).toFixed(2)));







    }

    this.cfg.data.labels = times;
   this.cfg.data.datasets[0].data = velocities;
    this.cfg2.data.labels = times;
    this.cfg2.data.datasets[0].data = positions;


    // Actualiza el gráfico
    this.chart?.update();
    // if (this.chart) {
     
    // }
    // Actualiza ambos gráficos
  
  }

  reset() {
    this.form.reset();
    this.heightFall = 0;

  }

  generateImage() {
  }

  // generateImage() {
  //   this.imgURLFull = '';

  //   if( this.numberImage < 3){

  //     this.numberImage++;
  //     console.log(this.numberImage);
  //   } else if(this.numberImage > 0){
  //     console.log('antes:' +  this.numberImage);
  //     this.numberImage--;
  //     console.log(this.numberImage);
  //   }
  //   this.imgURLFull = this.urlImage + this.numberImage.toString() + '.jpg';
  // }

  title = 'FISICAI-PIF';
}
