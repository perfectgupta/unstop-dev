import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-askgenie',
  templateUrl: './askgenie.component.html',
  styleUrls: ['./askgenie.component.scss']
})
export class AskgenieComponent {

  context: string = `Unstop derived from the belief to #BeUnstoppable, is a community engagement and hiring platform for students and freshers where talent meets opportunities.

  Founded by Ankit Aggarwal, Unstop is a playground for this talent to learn, upskill, showcase their skills, gain CV points and get hired while unlocking their true potential throughout their academic journey. This enables them to eventually get hired by their dream employers and start their career journey. The platform connects students across domains in INDIA to a world of opportunities across the GLOBE. Unstop currently has a community of 6 Million+ Students and Freshers.

  Unstop has been chosen by major brands such as Amazon, Flipkart, HUL, Reliance, Tata, Mahindra, Uber, Accenture, Infosys, EY, PwC, and many others for their early talent recruitment needs. These companies interact with students and early professionals at Unstop and leverage the platform's expertise to build their dream teams.

  Established as a blog by Ankit Aggarwal, a computer science grad at heart, Unstop (formerly known as Dare2Compete) aims to be the largest career transformation platform that democratizes learning, mentorships, competitions, and jobs.

  Unstop began its full-time operations in 2017 with a team of 3 and since then, it has been bootstrapped to a 70-member team, ~6 Mn+ users, and close to 1,20,000 opportunity listings with profits by its side.

  Earlier it was just a listing platform where organizers used to only list events, competitions, and challenges for extended visibility but after its pivot in May 2021, Unstop is now a full-stack engagements and hiring platform to do any sort of activities linked to employer branding and recruitment, namely, Brand, Source, Assess, Hire, & Engage. Unstop, derived from the belief to #BeUnstoppable, is a community engagement and hiring platform for students and freshers where talent meets opportunities.
  `;
  question: string = 'What is Unstop';
  response: string = '';
  loading: boolean = false;
  highlightedContext: SafeHtml;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.highlightedContext = '';
  }

  askQuestion(context: string, question: string) {
    this.response = '';
    this.loading = true;
    const apiUrl = 'http://127.0.0.1:8000/ask';

    const headers = new HttpHeaders().set('Accept', 'application/json');
    const requestBody = '';

    const requestData = {
      "context": context,
      "question": question
    };

    this.http.post(apiUrl, requestBody, { headers, params: { question: this.question, context: this.context } }).subscribe(
      (data: any) => {
        // Handle the API response here
        this.response = data.answer; // Assuming the API response contains an 'answer' property
        this.loading = false; // Hide the loader
        this.highlightedContext = this.highlightAnswerInContext(this.context, this.response);
        console.log(this.highlightedContext);
        this.context = context;
      },
      (error) => {
        // Handle API error here
        console.error('API Error:', error);
        this.loading = false; // Hide the loader on error
      }
    );
  }

  // highlightAnswerInContext(context: string, answer: string): string {
  //   const escapedAnswer = answer.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  //   const regex = new RegExp(escapedAnswer, 'gi');
  //   const highlightedContext = context.replace(regex, (match) => {
  //     return `<span class="highlight" style="font-weight: bold; background-color: yellow;">${match}</span>`;
  //   });

  //   console.log(highlightedContext);

  //   return highlightedContext;
  // }
  highlightAnswerInContext(context: string, answer: string) {
    const escapedAnswer = answer.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedAnswer, 'gi');
    let highlightedContext = context;

    // Find and highlight the answer within text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];

    textNodes.push(walker.currentNode);
    // while (walker.nextNode()) {
    // }

    textNodes.forEach((textNode) => {
      highlightedContext = highlightedContext.replace(regex, (match) => {
        return `<span class="highlight" style="font-weight: bold; background-color: yellow;">${match}</span>`;
      });
    });
    this.highlightedContext = this.sanitizer.bypassSecurityTrustHtml(highlightedContext);
    // highlightedHTMLContent = this.sanitizer.bypassSecurityTrustHtml(highlightedContext);

    return highlightedContext;
  }
}
