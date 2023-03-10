import { Component, OnInit } from '@angular/core';
import { FolderMakerConstants } from '../constants/folder-maker.constants';
import { FolderModel } from '../models/folder-maker.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public addToRootActive: boolean = false;
  public addToOtherActive: boolean = false;
  public showItemActions: boolean = false;
  public newFileFolderName: string = '';
  public newFileFolderType: number = 1;
  public currentItem:any = null;
  public CONST_FOLDER:string = FolderMakerConstants.folderTypeName;
  private CONT_FILE:string = FolderMakerConstants.fileTypeName;
  public baseNode: FolderModel = FolderMakerConstants.folderBoilerPlate;
  constructor() {}

  ngOnInit(): void {}

  public showhideAddtoRoot(show: boolean): void {
    this.addToRootActive = show;
  }

  private resetAddtoRoot(): void {
    this.newFileFolderName = '';
    this.showhideAddtoRoot(false);
  }
  private resetAddtoOthers() :void {
    this.newFileFolderName = '';
    this.currentItem = null;
    this.addToOtherActive = false;
  }

  public reset(isInRoot:boolean): void {
    isInRoot ? this.resetAddtoRoot():this.resetAddtoOthers();
  }

  public addtoTree(isInRoot:boolean): void {
    if(isInRoot) {
    this.newFileFolderName &&
      this.baseNode.children?.push(this.getFolderTemplate(this.newFileFolderName));
    this.resetAddtoRoot();
    } else {
      let newItem = +this.newFileFolderType ? this.getFolderTemplate(this.newFileFolderName) : this.getFileTemplate(this.newFileFolderName);
      this.pushtoTreeNode(this.currentItem.id, newItem, this.baseNode);
      this.resetAddtoOthers();
    }
  }

  public onitemAdd(item: FolderModel, event: Event): void {
    event.stopPropagation();
    this.resetAddtoRoot();
    this.addToOtherActive = true;
    this.currentItem = item;
  }

  public onitemDelete(item: FolderModel, event: Event): void {
    event.stopPropagation();
    const newval = this.removeFromTree(this.baseNode.children!, item.id);
    this.baseNode.children!.length = 0;
    this.baseNode.children = newval;
  }

  private getFolderTemplate(folderName: string): FolderModel {
    return {
      name: folderName,
      type: this.CONST_FOLDER,
      id: new Date().getTime(),
      children: [],
    };
  }

  private getFileTemplate(filename: string): FolderModel {
    return {
      name: filename,
      type: this.CONT_FILE,
      id: new Date().getTime()
    };
  }

  private removeFromTree(list: Array<FolderModel>, id: any): any {
    return list
      .map((item) => {
        return { ...item };
      })
      .filter((item) => {
        if ('children' in item) {
          item.children = this.removeFromTree(item.children!, id);
        }
        return item.id !== id;
      });
  }

  private pushtoTreeNode(
    id: number | string,
    pushItem: FolderModel,
    node: any
  ): void {
    if (node.id == id) {
      node.children?.push(pushItem);
    } else {
      for (var i = 0; i < node.children?.length!; i++) {
        this.pushtoTreeNode(id, pushItem, node.children[i]);
      }
    }
  }
}
