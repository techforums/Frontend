import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Blog } from 'src/app/model/blog';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-update-blog',
  templateUrl: './update-blog.component.html',
  styleUrls: ['./update-blog.component.css'],
})
export class UpdateBlogComponent {

  allblogs: Blog[] = [];
  public userId = localStorage.getItem('userId');
  public Editor: any = ClassicEditor;
  public maxLength: number = 2000;
  public title: any;
  public content: any;

  UpdateBlogForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(119),
    ]),
    content: new FormControl('', [
      Validators.required,
      Validators.maxLength(1500),
    ]),
  });

  blog: Blog = {
    _id: '',
    title: '',
    content: '',
    createdDate: new Date(), 
    updatedDate: new Date(),
    isApproved: new Boolean(),
    userId: '',
    user:{
      firstName: '',
      lastName: '',
    },
  };
  
  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.title = this.blog.title;
    this.content = this.blog.content;
    this.getBlogById(this.blog);
  }

  get valide() {
    return this.UpdateBlogForm.controls;
  }

  getBlogById(blog: Blog) {
    this.route.paramMap.subscribe((params: any) => {
      const bl: string = params.get('_id');
      this.profileService.getBlogById(bl!).subscribe(
        (res) => {
          this.blog = res;
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  editBlog(blog: Blog) {
    this.getBlogById(blog);
    this.title = blog.title;
    this.content = blog.content;
  }

  updateBlog() {
    this.userId = this.userId;
    this.profileService.updateBlogs(this.blog).subscribe(
      (res) => {
        this.editBlog(this.blog);
        this.getBlogById(this.blog);
        console.log(res.updatedDate);
        console.log(res);
        this.router.navigate(['/manageresources']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
