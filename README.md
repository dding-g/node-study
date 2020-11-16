# Node.js, React Study

## 사용 스택 
*	Backend : Node.js
* 	Frontend : React.js
* 	DataBase : MongoDBs

## 내용

### React 모듈화
#### Post Page 모듈화
*	PostViewPage, PostEditPage의 공통 부분들을 PostCotainer로 모듈화.
#### UI, UX
*	로그아웃 버튼 위치를 홈페이지에서 NavBar로 옮김
	- [x] 로그인 후 새로고침을 해야 Navbar가 refresh 되는 문제가 있음
		- 각 Component에 LoginBanner 컴포넌트를 추가는 방식으로 진행
#### TODO
 
*	[x] PostContainer.js 와 PostPage.js 합치기
-	[x] FileManagePage.js 에서 ReactDOM.render() 삭제
	-	[x] Component를 list에 push할 필요 없음. React document list,key 참고
	-	[x] React.createElement() 사용 UX
	-	ReactDOM.render 나 createElement()를 사용하지 않고 JSX만으로 다시 구현. 
-	[x] LoginBanner.js 다시 구성. 최상위에서 props 으로 email 관리
-   [ ] Chatting, Login 페이지 input 수정할때 왜 전체가 다시 렌더링 되는가?
-	[ ] ChattingPage 에서 https 로 변경해도 채팅이 가능하도록 하기