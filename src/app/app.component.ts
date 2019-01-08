import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'reactive-forms';
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames = ['Asscruncher', 'Cockfighter', 'Dickalicious'];

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]),
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails)
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });

    // track value changes of form controls
    // this.signupForm.valueChanges.subscribe(
    //   (value) => console.log(value)
    // );

    // track status changes of form controls
    this.signupForm.statusChanges.subscribe(
      (status) => console.log(status)
    );

    // set values of form controls for the reactive approach
    // also possible to use .patchValue();
    this.signupForm.setValue({
      'userData': {
        'username': 'sharisM',
        'email': 'sharis@sharis.lt'
      },
      'gender': 'male',
      'hobbies': []
    });
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset();
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  // my own form validator
  forbiddenNames(control: FormControl): {[s: string]: boolean} {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null;
  }

  // async validator for email
  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'emailsForbidden': true});
        } else {
          resolve(null);
        }
      }, 1500);
    });
    return promise;

  }
}
