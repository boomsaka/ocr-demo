import { Component } from '@angular/core';
import {createWorker} from 'tesseract.js';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  worker: Tesseract.Worker;
  workerReady = false;
  image = './assets/eng_bw.png'
  captureProgress = 0;
  ocrResult = '';
  statusMsg = '';

  constructor() {
    this.loadWorker();
  }

  async loadWorker(){
    this.worker = createWorker({
      logger: progress => {
        console.log(progress);
        this.statusMsg = progress.status;
        if (progress.status == 'recognizing text') {
          this.captureProgress = parseInt('' + progress.progress * 100);
        }
      }
    });

    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    console.log('FIN');
    this.workerReady = true;
  }

  async captureImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
    console.log('image: ', image);
    this.image = image.dataUrl;
  }

  async recongnizeImage(){
    const result = await this.worker.recognize(this.image);
    console.log(result);
    this.ocrResult = result.data.text;
  }
}
