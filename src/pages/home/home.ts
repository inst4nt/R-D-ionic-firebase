import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  ActionSheetController
} from "ionic-angular";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  songsList: AngularFireList<any>;
  songs: Observable<any[]>;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    afDatabase: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController
  ) {
    this.songsList = afDatabase.list("/songs");
    this.songs = this.songsList.valueChanges();
  }

  addSong() {
    let prompt = this.alertCtrl.create({
      title: "Song Name",
      message: "Enter a name fot this new song you're se keen on adding",
      inputs: [
        {
          name: "title",
          placeholder: "Title"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Save",
          handler: data => {
            const newSongRef = this.songsList.push({});

            newSongRef.set({
              id: newSongRef.key,
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }

  showOptions(songId, songTitle) {
    let actionSheet = this.actionSheetCtrl.create({
      title: "What do you want to do ?",
      buttons: [
        {
          text: "Delete song",
          role: "destructive",
          handler: () => {
            this.removeSong(songId);
          }
        },
        {
          text: "Update title",
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeSong(songId: string) {
    this.songsList.remove(songId).then(() => {
      console.log("Song deleted");
    });
  }

  updateSong(songId, songTitle) {
    let prompt = this.alertCtrl.create({
      title: "Song Name",
      message: "Update the name for this song",
      inputs: [
        {
          name: "title",
          placeholder: "Title",
          value: songTitle
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Save",
          handler: data => {
            this.songsList.update(songId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
