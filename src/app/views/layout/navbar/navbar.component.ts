import { Component, OnInit, ViewChild, ElementRef, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  data: any;
  fullname: string;
  adminEmail: string;

  constructor(
    @Inject(DOCUMENT) private document: Document, 
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.data = localStorage.getItem('data');
    var localData = JSON.parse(this.data);
    this.fullname = localData.firstName+' '+localData.lastName;
    this.adminEmail = localData.email;
  }

  /**
   * Sidebar toggle on hamburger button click
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    this.document.body.classList.toggle('sidebar-open');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();
    //localStorage.removeItem('isLoggedin');
    localStorage.clear();
    //if (!localStorage.getItem('isLoggedin')) {
      this.router.navigate(['/auth/login']);
    //}
  }

}
