import { Component, ElementRef, ViewChild } from '@angular/core';

import { NgForm } from '@angular/forms';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss'],
})
export class ManageProductsComponent {
  edtMode: boolean = false;
  spring: boolean = false;
  editUserId: any;
  @ViewChild('userForm') userForm: any = NgForm;
  url = 'https://productcrud-3c1af-default-rtdb.firebaseio.com/user.json';
  Store: any[] = [];
  constructor(private http: HttpClient) {}
  // data post on server

  onAddUser(userData: any) {
    // console.log(userData);

    if (this.edtMode) {
      // console.log('https://productcrud-3c1af-default-rtdb.firebaseio.com/user/' +this.editUserId +'.json ');
      this.http
        .put(
          'https://productcrud-3c1af-default-rtdb.firebaseio.com/user/' +
            this.editUserId +
            '.json ',
          userData
        )
        .subscribe((ress) => {
          console.log(ress);
          this.fetchUser();
        });
      this.edtMode = false;
      // this.userForm.setValue({                          //it is use the data in form so use setValue
      //   name: "",
      //   technology:"",
      // });
      this.userForm.reset();
    } else {
      console.log(userData);
      this.Store.push(userData);
      this.http.post(this.url, userData).subscribe((ress) => {
        console.log(ress);
      });
      this.userForm.reset();
    }
  }

  fetchUser() {
    this.http
      .get(this.url)
      .pipe(
        map((res: any) => {
          console.log(res);
          const userArray: any = [];
          for (let key in res) {
            // console.log(res[key]);
            // console.log("dfgh",res.hasOwnProperty(key))
            if (res.hasOwnProperty(key)) {
              userArray.push({ userId: key, ...res[key] });
            }
          }
          return userArray;
        })
      )
      .subscribe((users) => {
        console.log('sd', users);
        this.Store = users;
      });
  }
  // data delete
  onDeleteUser(userId: any) {
    if (confirm('do you want to delete this user')) {
      // console.log('https://productcrud-3c1af-default-rtdb.firebaseio.com/user/'+userId+"json");
      this.http
        .delete(
          'https://productcrud-3c1af-default-rtdb.firebaseio.com/user/' +
            userId +
            '.json '
        )
        .subscribe(() => {
          // console.log(res);

          this.fetchUser();
        });
    }
  }

  onEditItem(userId: any, index: any) {
    console.log(userId);
    this.editUserId = userId;
    this.edtMode = true;
    console.log(this.Store[index]);
    this.userForm.setValue({
      //it is use the data in form so use setValue
      name: this.Store[index].name,
      technology: this.Store[index].technology,
    });
  }
  ngOnInit() {
    this.fetchUser();
  }
}
