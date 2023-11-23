import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})


export class FormComponent implements OnInit {
  users: any = [];
  isLoading: boolean = false;
  user: any = {};
  reset: boolean = true;
  formData: any = {};
  error: String = '';
  success: String = '';


  resetInput() {
    this.reset = true
    this.formData = {};
  }

  constructor(private http: HttpClient) {

  }

  deleteUser(id: any) {
    this.isLoading = true;
    this.http.delete(`http://localhost:5000/user/${id}`).subscribe(
      (Response) => { console.log(Response), this.fetchallUsers() }
    )
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onSubmit() {
    this.isLoading = true;
    this.http.post(`http://localhost:5000/user`, this.formData).subscribe(
      (Response: any) => {
        this.success = `User ${Response?.savedUser?.name} successfully created!`,
          setTimeout(() => {
            this.success = '';
          }, 2500);
        this.fetchallUsers()
      },
      (Error) => {
        console.log(Error)
        this.error = Error?.error?.message;
        setTimeout(() => {
          this.error = '';
        }, 2500);
      }
    )
    setTimeout(() => {
      this.isLoading = false;
      this.formData = {};
    }, 1000);
  }

  getUser(id: any) {
    this.reset = false
    this.http.get(`http://localhost:5000/user/${id}`).subscribe(Response => {
      if (Response) {
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
        this.formData = Response
      }
    })
  }

  async ngOnInit() {
    await this.fetchallUsers();
  }

  fetchallUsers() {
    return new Promise((resolve, rej) => {
      this.http.get('http://localhost:5000/users').subscribe(Response => {
        this.isLoading = true;
        if (Response) {
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
          this.users = Response
          resolve('');
        }
      })
    })
  }

  editUser() {
    this.isLoading = true;
    try {
      this.http.put(`http://localhost:5000/user/${this.formData?._id}`, this.formData).subscribe(Response => {
        if (Response) {
          console.log(Response);
          this.fetchallUsers();
          setTimeout(() => {
            this.isLoading = false;
            this.resetInput();
            this.success = `User edits saved successfully`
          }, 1000);

          setTimeout(() => {
            this.success = ``
          }, 2000);
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}
