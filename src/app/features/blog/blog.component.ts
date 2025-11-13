import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [BreadcrumbComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  breadcrumbItems: MenuItem[] = [];

  posts = [
    {
      image: '/images/blogs/blog-1.png',
      category: 'Fashion',
      dateISO: '2022-12-30',
      dateLabel: 'Dec 30, 2022',
      title: 'Minimalist winter looks you’ll love',
      excerpt: 'Discover how to keep warm and stylish this winter with minimalist outfits that never go out of trend.',
      href: '#'
    },
    {
      image: '/images/blogs/blog-2.png',
      category: 'Lifestyle',
      dateISO: '2023-01-12',
      dateLabel: 'Jan 12, 2023',
      title: '5 morning habits of successful people',
      excerpt: 'Your day begins the night before — explore routines that can help you start your mornings right.',
      href: '#'
    },
    {
      image: '/images/blogs/blog-3.png',
      category: 'Fashion',
      dateISO: '2023-02-08',
      dateLabel: 'Feb 08, 2023',
      title: 'The return of neutral tones',
      excerpt: 'Beige, cream, and taupe are making a comeback. Learn how to style these calming tones effortlessly.',
      href: '#'
    },
    {
      image: '/images/blogs/blog-1.png',
      category: 'Trends',
      dateISO: '2023-03-05',
      dateLabel: 'Mar 05, 2023',
      title: 'Why everyone’s talking about sustainable fabrics',
      excerpt: 'Eco-friendly materials are more than a fad — they’re shaping the future of fashion design.',
      href: '#'
    },
    {
      image: '/images/blogs/blog-2.png',
      category: 'Inspiration',
      dateISO: '2023-03-20',
      dateLabel: 'Mar 20, 2023',
      title: 'Creative outfit ideas for spring',
      excerpt: 'Mix and match light layers to express yourself with colors, textures, and confidence this spring.',
      href: '#'
    },
    {
      image: '/images/blogs/blog-3.png',
      category: 'Guides',
      dateISO: '2023-04-02',
      dateLabel: 'Apr 02, 2023',
      title: 'How to build a capsule wardrobe',
      excerpt: 'Simplify your closet with timeless pieces that pair with everything — and never go out of style.',
      href: '#'
    }
  ];

  ngOnInit(): void {
    this.breadcrumbItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Blog' },
    ];
  }
}
