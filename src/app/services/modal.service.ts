import { Injectable } from '@angular/core';

interface IModal {
  id: string,
  visible : boolean
}
@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private visible = false;
  private modals: IModal[] = [];
  constructor() { }

  register(id:string){
    this.modals.push({
      id,
      visible:false
    });
  }

  unregister(id: string){
    this.modals = this.modals.filter( el => el.id !== id);
  }

  isModalOpen(id:string): boolean{
    return Boolean(this.modals.find( el => el.id === id)?.visible)
  }

  toggleModal(id: string){
    const modal = this.modals.find( el => el.id === id);
    if (modal){
      modal.visible = !modal.visible
    }
  }

}
