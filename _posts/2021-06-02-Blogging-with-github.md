---
layout: post
title: Github, Jekyll과 Lanyon Plus을 이용하여 블로그 만들기
date: "2021-06-02"
category: 
  - Etc
tags:
  - Github
  - Blog
  - Jekyll
  - Lanyon
toc: true
toc_label: "Github, Jekyll과 Lanyon Plus을 이용하여 블로그 만들기"
---
 
### 선택 장애: 플랫폼 선택하기
블로그를 시작하기로 하면서 플랫폼을 결정하는 것이 가장 힘들었다. 큰 수정 없이 out-of-box로 블로깅을 시작할 수 있는 Wordpress와 Tistory 등의 플랫폼이 존재하였지만 개발을 하면서 익숙해져있던 Github에 더 눈이 갔기때문이다. 개발자라면 누구나 한번쯤은 사용해봤을 Github는 version control, code review등 코딩 환경을 제공해줄뿐만 아니라 Github Pages를 통하여 개인 프로젝트 페이지를 "무료"로 호스팅해준다. 기존에 Github를 사용하고 있던 나로서는 Github Pages를 꾸미는데 필요한 Markdown이라는 기술에 이미 익숙해져 있었기에 Github Pages로 블로깅을 시작하기로 하였다.
<br>

### 문제점
Github Pages만으로는 광활한 흰 화면에 글자만 남는 무미건조한 블로그가 만들어진다. 임시방편으로 게시물마다 Markdown을 사용하여 사진과 동영상을 넣을 수 있지만 이는 말 그대로 임시방편. 결국은 기본적인 디자인을 꾸며야했다. Github Pages와 같은 static website를 꾸며주는 static content site builder가 필요했고 가장 유명한 Jekyll을 선택하기로 하였다. 물론 가장 유명하다는 이유로 선택한 것은 아니다. Jekyll을 사용하기 위해서 새로운 프로그래밍 언어를 배워야했다면 다른 선택지를 고려해봤을 것이다. 하지만 그럴 필요가 없었고 아래와 같은 장점이 있었기에 Jekyll가 최선의 선택이라고 생각되었다.
<br>  
 
#### Jekyll은
* 텍스트기반의 블로깅 환경 - Markdown또는 HTML로 블로그를 작성한다. 기존에 Github를 사용하고 있었던 사람이라면 자신의 프로젝트또는 Repository를 어필하기 위하여 Readme.MD를 수정한 경험이 많을 것이다. 텍스트로만 작성하여야하고 이미지또는 비디오의 경우 코드를 사용하여 넣어야하는 불편함이 존재하지만 그 외 테크관련 블로그에서 흔히 볼 수 있는 "코드 강조" 같은 기능이 매우 쉽게 구현되어있어 기술적인 내용을 서술할때 매우 편리하다.
 
* Github와의 연동 - Github가 공식적으로 지원하고 있으며 무료로 호스팅을 해주고있다. Wordpress같은 경우에는 $5정도의 호스팅비를 매 달 납부하여야하며 (지금은 모두에게 오픈되어있지만) Tistory의 경우에는 초대장이 있어야만 사용 가능하였다. 공짜라는 장점과 개발자에게는 Google같이 익숙한 Github와 연동이 된다는 점이 마음에 들었다


#### Lanyon Plus Theme
Jekyll기반 블로그를 만들면서 레이아웃부터 만들 이유가 없었다. 그랬다면 Jekyll을 선택하지도 않았을 것이며 Github Pages대신 Tistory나 Wordpress같이 여러가지 스킨을 기본적으로 제공해주는 플랫폼을 찾아보고 있었을 것이다. 다행히도 Jekyll 역시 이러한 Theme을 제공하고 있었으며 나는 가장 심플하면서도 내가 필요로 하는 기능을 갖추고 있는 Lanyon Plus Theme을 택하였다. 화려한 기능과 디자인을 가진 테마들이 여럿 존재하였지만 블로그는 블로그답게 최대한 내용에 집중할 수 있도록 심플한 스킨을 선택했으며, 이는 추후에 몇번의 클릭과 몇 줄의 코드만으로 새로운 것을 추가할 수 있었기에 내 인생 모토인 "Keep it simple, stupid."에 충실하기로 하였다.

<br> 
<br> 
### 우분투에서 Jekyll 시작하기

##### 1. Github Pages 만들기
 
우선적으로 해야하는 것은 블로그를 호스팅할 Github Pages를 만드는 것이다. 이는 매우 간단한데 아래와 같이 본인의 Github 페이지에서 New Repository를 만드는 과정과 같다.

![](https://michaelhur.github.io/images/20210602/githubpages1.png)

여기서 다른 점은 Repository의 이름을 (username).github.io로 지정해주어야한다.

![](https://michaelhur.github.io/images/20210602/githubpages2.png)
 
Github Pages를 만든 후에는 아래와 같은 bash command를 실행하여 블로그의 내용을 저장할 폴더를 복사해오면 된다.
   
```
git clone https://github.com/(username).github.io.git
```
<br>
<br>
##### 2. Jekyll 설치
 
이제 Github Pages를 만들었으니 블로그를 만들 Jekyll을 설치할 차례다. Jekyll은 Ruby라는 프로그래밍 언어로 만들졌으며, 사용하기 위해서는 Ruby를 설치해야한다.
 
```
sudo apt-get install ruby-full
```

Ruby를 설치하였으니 Jekyll을 설치할 차례다.
 
```
gem install jekyll
```
끝!
<br>
<br>
##### 3. 원하는 Jekyll Theme 적용하기

https://jekyllthemes.io/ 에는 많은 Jekyll Theme을 제공하고 있다. 마음에 드는 Theme을 찾아서 다운로드만 하면 끝. 다운로드를 한 Theme은 위에 복사해온 `(username).github.io` 폴더에 복사하면 된다.
<br>
<br>
##### 4. 테스팅

제대로 설치되었는지 확인하기 위해서, 그리고 추후에 블로그 포스트를 작성하는 과정에서 내용을 확인할때 아래와 같이 테스트를 하면 된다. 이는 실제로 블로그를 호스팅하는 (username).github.io 페이지에 전혀 영향을 주지않는다.

```
cd username.github.io
jekyll build
jekyll serve
```
<br>
<br>
##### 5. Github Pages에 업로드

내가 작성한 블로그 포스트가 아무런 문제가 없었다면 이제는 블로그에 업로드할 차례이다. Github Pages라고 기존 Github Repository와 별반 다를바 없다. 아래와 같은 bash command로 Github에 업로드하면 된다.

```
cd username.github.io
git init
git remote add origin https://github.com/username/username.github.io.git
git add .
git commit -m "message"
git push origin master
```

아무런 오류가 없이 끝났다면 본인의 블로그 페이지인 `username.github.io`에서 확인해보자.
<br>
<br>
##### 6. 추가 기능 설치: Google Analytics

먼저 Google Analytics를 사용하기 위해서는 Google 계정이 필요하다. 가입후 추적하고자하는 블로그의 url주소를 입력하면 추적 ID가 주어진다. 


추적 ID를 복사하여 아래와 같이 입력후 `google_analytics.html` 라는 이름으로 `_includes` 폴더에 저장하면 된다.

```
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', '추적 ID', 'auto');
  ga('send', 'pageview');

</script>
```

이 후 `_layout`폴더에 있는 `default.html`파일을 열어 아래와 같이 코드를 추가하여야 한다.

```
<body>
    {% include google_analytics.html %} 
```

마지막으로 `_config.yml`파일을 열어 아래의 코드를 입력 후 저장하면 끝.

```
google_analytics: 추적_ID
```
<br>
<br>
#### 끝내면서

블로그를 쓰기로 시작하면서 Github Pages를 플랫폼으로 선택하였고 Jekyll을 이용하며 블로그의 토대를 만드는 작업을 하였다. 아무래도 Tistory나 Wordpress에 비해서 기본 토대가 짜여져있지않은 플랫폼을 선택하다보니 해당 블로그 포스트를 작성하는 것보다 블로그 자체를 만드는데 더 많은 시간을 투자하게 되었다. 
하지만 이 단계는 처음 블로그를 만든 순간과 추후에 새로운 기능을 추가할때 빼고는 딱히 신경쓰지 않아도 되는 부분이니 만큼 이제는 블로그를 채워넣을 내용에 집중할 수 있어서 좋다.
