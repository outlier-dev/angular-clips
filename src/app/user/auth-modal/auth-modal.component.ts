import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent implements OnInit, OnDestroy{
  constructor(public modal:ModalService) {
  }

  ngOnInit(){
    this.modal.register('auth');
  }

  ngOnDestroy(){
    this.modal.unregister('auth');
  }

}
