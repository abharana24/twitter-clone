import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import ParseJwt from "../utils/parsejwt";
import { IUser, IJwtPayload , ICount} from "../models/user.interface";
import { Router, ActivatedRoute, Params } from "@angular/router";


@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {
  user: IUser = {
    dob: "",
    userhandle: "",
    email: "",
    password: "",
    bio:"",
    name: "",
    location:"",
    count: {
      followerCount: 0,
      followingCount: 0,
      tweetCount: 0,
    }
  };
  follow: boolean;
  currentUser: IJwtPayload = ParseJwt.parseJwt();
  redirectedUser: string;
  
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
    ) {}
  

  ngOnInit() {
    this.router.navigate(["/profile/" + this.currentUser.userhandle]);    
    let current_route = this.router.url.split("/");
    let currentUserId = this.currentUser._id;
    this.loadUserDetails(currentUserId);
  
  }
   loadUserDetails(currentUserId){
    this.userService.userDetails(currentUserId).subscribe(res => {
      if(res.status == 200){
        this.user = res.body;
      }
      else if(res.status == 401){
        localStorage.removeItem("token");
        this.router.navigate(['/login']);
      }
    });
   }   


}
