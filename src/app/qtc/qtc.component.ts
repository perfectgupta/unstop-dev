import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-qtc',
  templateUrl: './qtc.component.html',
  styleUrls: ['./qtc.component.scss']
})
export class QtcComponent {

  inputText: string = 'What is the role of __init__ function in python?';
  isLoading: boolean = false;
  labels: string[] = [];
  isSidePanelOpen = false;
  supportedTags: string[] = ['.net', '.net-core', 'ajax', 'algorithm', 'amazon-ec2', 'amazon-s3',
  'amazon-web-services', 'android', 'android-studio', 'angular', 'ansible',
  'apache', 'apache-kafka', 'apache-spark', 'apache-spark-sql', 'api', 'arrays',
  'asp.net', 'asp.net-core', 'asp.net-mvc', 'authentication', 'aws-lambda',
  'axios', 'azure', 'azure-devops', 'bash', 'beautifulsoup', 'bootstrap-4', 'c',
  'c#', 'c++', 'class', 'css', 'csv', 'dart', 'database', 'dataframe', 'date',
  'datetime', 'deep-learning', 'dictionary', 'discord', 'discord.js',
  'discord.py', 'django', 'django-models', 'django-rest-framework',
  'django-views', 'docker', 'docker-compose', 'dplyr', 'elasticsearch', 'email',
  'entity-framework', 'entity-framework-core', 'excel', 'express', 'file',
  'firebase', 'firebase-realtime-database', 'flask', 'flutter', 'for-loop',
  'forms', 'function', 'ggplot2', 'git', 'github', 'go', 'google-apps-script',
  'google-chrome', 'google-cloud-firestore', 'google-cloud-platform',
  'google-sheets', 'gradle', 'graphql', 'heroku', 'hibernate', 'html', 'http',
  'if-statement', 'image', 'ionic-framework', 'ios', 'java', 'javascript',
  'jenkins', 'jestjs', 'jquery', 'json', 'jupyter-notebook', 'keras', 'kotlin',
  'kubernetes', 'laravel', 'linux', 'list', 'loops', 'machine-learning', 'macos',
  'material-ui', 'matlab', 'matplotlib', 'maven', 'mongodb', 'mongoose',
  'multithreading', 'mysql', 'networking', 'next.js', 'nginx', 'node.js', 'npm',
  'numpy', 'object', 'oop', 'opencv', 'oracle', 'pandas', 'pdf', 'performance',
  'php', 'pip', 'plot', 'postgresql', 'powerbi', 'powershell', 'pyspark', 'python',
  'python-3.x', 'python-requests', 'pytorch', 'qt', 'r', 'react-hooks',
  'react-native', 'react-redux', 'reactjs', 'recursion', 'redux', 'regex', 'rest',
  'ruby', 'ruby-on-rails', 'rust', 'scala', 'scikit-learn', 'selenium',
  'selenium-webdriver', 'shell', 'sockets', 'spring', 'spring-boot', 'sql',
  'sql-server', 'sqlite', 'ssl', 'string', 'swift', 'swiftui', 'tensorflow',
  'terraform', 'testing', 'tkinter', 'tsql', 'typescript', 'ubuntu', 'unity3d',
  'user-interface', 'vb.net', 'vba', 'visual-studio', 'visual-studio-code',
  'vue.js', 'web', 'web-scraping', 'webpack', 'websocket', 'windows', 'winforms',
  'woocommerce', 'wordpress', 'wpf', 'xamarin', 'xamarin.forms', 'xcode', 'xml']; // You can update this list as needed.
  time_taken: number = 0;


  constructor(private http: HttpClient) {}

  predictTags(inputText: string) {
    if (inputText != '') {
      // const apiURL = `http://localhost:8000/predict?text=${encodeURIComponent(inputText)}`;
      const apiURL = `https://mklobj224fnefrr6n77i5th5yi0vljdo.lambda-url.ap-south-1.on.aws/predict?text=${encodeURIComponent(inputText)}`;

      this.isLoading = true;
      this.http.post<any>(apiURL, {}).subscribe(response => {
        this.isLoading = false;
        if (response.labels.length > 0) {
          this.labels = response.labels;
          this.time_taken = response.time_taken * 1000;
        } else {
          this.labels = ['No tags predicted!'];
          this.time_taken = 0;
        }
      });
    }
    else {
      this.labels = ['Enter the question first!'];
    }
  }

  getRandomColor() {
    const r = Math.floor(Math.random() * 128) + 127; // ensures R value between 127 and 255
    const g = Math.floor(Math.random() * 128) + 127; // ensures G value between 127 and 255
    const b = Math.floor(Math.random() * 128) + 127; // ensures B value between 127 and 255
    return `rgb(${r},${g},${b})`;
  }

  toggleSidePanel() {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

}
