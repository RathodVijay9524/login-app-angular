import { Component } from '@angular/core';
import { WorkerHeader } from '../worker-header/worker-header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-worker-layout',
  imports: [WorkerHeader,RouterOutlet],
  templateUrl: './worker-layout.html',
  styleUrl: './worker-layout.css'
})
export class WorkerLayout {

}
