var store = [{
        "title": "Github, Jekyll과 Minimal Mistakes를 이용하여 블로그 만들기",
        "excerpt":"선택 장애: 플랫폼 선택하기 블로그를 시작하기로 하면서 플랫폼을 결정하는 것이 가장 힘들었다. 큰 수정 없이 out-of-box로 블로깅을 시작할 수 있는 Wordpress와 Tistory 등의 플랫폼이 존재하였지만 개발을 하면서 익숙해져있던 Github에 더 눈이 갔기때문이다. 개발자라면 누구나 한번쯤은 사용해봤을 Github는 version control, code review등 코딩 환경을 제공해줄뿐만 아니라 Github Pages를 통하여 개인 프로젝트...","categories": [],
        "tags": ["Github","Blog","Jekyll","Minimal Mistakes"],
        "url": "/Blogging-with-github/",
        "teaser": null
      },{
        "title": "PyMLB: Exploring MLB Data using Python",
        "excerpt":"Sabermetrics: Analysis of Baseball As Bill James said “sabermetrics is the search for objective knowledge about baseball.” Unlike the classical baseball statistics such as win or home run, it aims to derive statistic that can objectively quantify the players’ performance. For example, in 2018 New York Mets’ rookie pitcher Jacob...","categories": [],
        "tags": ["Python","API","Wrapper","Baseball","MLB","Data"],
        "url": "/PyMLB/",
        "teaser": null
      },{
        "title": "NoSQL and SQL - Part 1",
        "excerpt":"Introduction It is not always the case that perfectly cleaned and prepared data is available for data scientitsts to work with. In many times, data preprocessing is needed to feed the data into the later prcoesses such as analysis and visualization. This preprocessing step can be minimized, if not eliminated,...","categories": [],
        "tags": ["MongoDB","NoSQL","SQL","Data"],
        "url": "/MongoDB/",
        "teaser": null
      },{
        "title": "PyMLB to plot Pitch f/x data",
        "excerpt":"This time we will look at what the strike zone looks like for a Korean Pitcher “Ryu Hyun-Jin.” from PyMLB import * 1. Pull schedule data First we need to pull all the game ID for this particular pitcher for this season. Using get_schedule() function we coded last time, we...","categories": [],
        "tags": ["Python","API","Wrapper","Baseball","MLB","Data","Plotly"],
        "url": "/Strike-Zone/",
        "teaser": null
      },{
        "title": "Sudoku: A systemic approach to Sudoku - Part 1",
        "excerpt":"Rule of Sudoku Every square has to contain a single number Only the numbers between 1 and 9 (inclusive) can be used Each 3×3 subgrid can only contain each number from 1 to 9 once Each column can only contain each number from 1 to 9 once Each row can...","categories": [],
        "tags": ["Python","Sudoku","Bruteforce","Backtracking"],
        "url": "/Sudoku-Part-1/",
        "teaser": null
      },{
        "title": "Sudoku: A systemic approach to Sudoku - Part 2",
        "excerpt":"Rule of Sudoku Every square has to contain a single number Only the numbers between 1 and 9 (inclusive) can be used Each 3×3 subgrid can only contain each number from 1 to 9 once Each column can only contain each number from 1 to 9 once Each row can...","categories": [],
        "tags": ["Python","Sudoku","Crook","Algorithm"],
        "url": "/Sudoku-Part-2/",
        "teaser": null
      },{
        "title": "Keras로 신경망 구축하기",
        "excerpt":"케라스에서 MNIST 데이터셋 적재하기 머신 러닝에서 분류 문제의 범주 (category) 를 class 데이터 포인트는 sample 특정 샘플의 클래스는 label from keras.datasets import mnist (train_images, train_labels), (test_images, test_labels) = mnist.load_data() train_images.shape (60000, 28, 28) len(train_labels) 60000 train_labels array([5, 0, 4, ..., 5, 6, 8], dtype=uint8) test_images.shape (10000, 28, 28) len(test_labels) 10000...","categories": [],
        "tags": ["Python","Machine Learning","Deep Learing","Neural Network","Keras"],
        "url": "/2.1-%EC%8B%A0%EA%B2%BD%EB%A7%9D%EA%B3%BC%EC%9D%98%EC%B2%AB-%EB%A7%8C%EB%82%A8/",
        "teaser": null
      },{
        "title": "Tensor Operation - Type of Tensors",
        "excerpt":"이전 예제에서는 다차원 넘파이 배열에 데이터를 저장하는 것을 배움. 최근의 머신 러닝 시스템은 일반적으로 텐서 tensor를 기본 데이터 구조로 사용함. 그렇다면 tensor란 무엇인가? tensor는 데이터를 위한 container 거의 항상 수치형 데이터를 다루므로 숫자를 위한 컨테이너 2.2.1 Scalar (0D Tensor) 하나의 숫자만 담고있는 텐서를 scalar 또는 0D tensor라고 부름 import numpy...","categories": [],
        "tags": ["Python","Machine Learning","Deep Learing","Neural Network","Keras","Tensor"],
        "url": "/2.2-%EC%8B%A0%EA%B2%BD%EB%A7%9D%EC%9D%84-%EC%9C%84%ED%95%9C-%EB%8D%B0%EC%9D%B4%ED%84%B0-%ED%91%9C%ED%98%84/",
        "teaser": null
      },{
        "title": "Tensor Operation",
        "excerpt":"심층 신경망이 학습한 모든 변환을 수치 데이터 텐서에 적용하는 Tensor Operation (텐서 연산) 첫번째 예제에서 Dense 층을 쌓아서 신경망을 만들었음 keras.layers.Dense(512, activation = 'relu') 이 층은 2D Tensor를 입력받고 새로운 표현인 또 다른 2D Tensor를 반환하는 함수로 해석할 수 있음. 구체적으로 보면: output = relut(dot(W, input) + b) 3가지 텐서...","categories": [],
        "tags": ["Python","Machine Learning","Deep Learing","Neural Network","Keras"],
        "url": "/2.3-%EC%8B%A0%EA%B2%BD%EB%A7%9D%EC%9D%98-%ED%86%B1%EB%8B%88%EB%B0%94%ED%80%B4-%ED%85%90%EC%84%9C-%EC%97%B0%EC%82%B0/",
        "teaser": null
      },{
        "title": "Stochastic Gradient Descent",
        "excerpt":"output = relu(dot(W, input) + b) 이 식에서 Tensor W와 b는 층의 속성처럼 볼 수 있음. 가중치 (weight) 또는 훈련되는 파라미터 (trainable parameter) 라고 부름. 이런 가중치에 훈련 데이터를 신경망에 노출시켜서 학습된 정보가 담겨 있음. 초기에는 가중치 행렬이 작는 난수로 채워져있고 이를 무작위 초기화 (Random Initialization) 단계라고 부름. W와 b가...","categories": [],
        "tags": ["Python","Machine Learning","Deep Learing","Neural Network","Keras"],
        "url": "/2.4-%EC%8B%A0%EA%B2%BD%EB%A7%9D%EC%9D%98-%EC%97%94%EC%A7%84-%EA%B7%B8%EB%9E%98%EB%94%94%EC%96%B8%ED%8A%B8-%EA%B8%B0%EB%B0%98-%EC%B5%9C%EC%A0%81%ED%99%94/",
        "teaser": null
      },{
        "title": "신경망의 구조",
        "excerpt":"신경망 훈련에는 다음 요소들이 관련되어있다. 네트워크 (모델)을 구성하는 층 (Layer) 입력 데이터와 상응하는 타깃 학습에 사용할 피드백 신호를 정의하는 손실 함수 (Loss Function) 학습 진행 방식을 결정하는 Optimizer 연속된 층으로 구성된 네트워크가 입력 데이터를 예측으로 매핑 $x$ -&gt; $\\hat{y}$ 손실 함수는 예측과 타깃을 비교하여 네트워크의 예측이 기댓값에 얼마나 잘 맞는지...","categories": [],
        "tags": ["Python","Machine Learning","Deep Learing","Neural Network","Keras"],
        "url": "/%EC%8B%A0%EA%B2%BD%EB%A7%9D%EC%9D%98-%EA%B5%AC%EC%A1%B0/",
        "teaser": null
      },{
        "title": "IMDM 데이터셋을 이용한 이진 분류",
        "excerpt":"IMDB Dataset Internet Movie Database (IMDB)로부터 추출한 50,000개의 리뷰로 이루어진 데이터셋 25,000개의 훈련 데이터와 25,000개의 테스트 데이터 50% 긍정적 리뷰, 50% 부정적 리뷰 IMDB 데이터셋 로드하기 from keras.datasets import imdb (train_data, train_labels), (test_data, test_labels) = imdb.load_data(num_words = 10000) &lt;__array_function__ internals&gt;:5: VisibleDeprecationWarning: Creating an ndarray from ragged nested sequences (which is...","categories": [],
        "tags": ["Python","Machine Learning","Deep Learing","Neural Network","Keras","IMDB","Binary Classification"],
        "url": "/IMDB-Binary-Classification/",
        "teaser": null
      },{
        "title": "Reuter 데이터셋을 이용한 다중 분류",
        "excerpt":"이번 포스트에서는 Reuter News Dataset을 사용하여 46개의 토픽으로 분류하는 신경망을 만들어 본다. 클래스가 많은 다중 분류 multiclass classification의 예시이다. 더 정확히 하자면 단일 레이블 다중 분류 single-label, multiclass classification 문제이다. 각 데이터 포인트가 여러개 범주에 속할 수 있다면 다중 레이블 다중 분류 multi-label, multiclass classification 문제가 된다. 로이터 데이터셋 1986년에...","categories": [],
        "tags": ["Python","Machine Learning","Deep Learing","Neural Network","Keras","IMDB","Binary Classification"],
        "url": "/Reuters-News-Classification/",
        "teaser": null
      }]
