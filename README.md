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
	- [ ] 로그인 후 새로고침을 해야 Navbar가 refresh 되는 문제가 있음

#### TODO

*	[x] PostContainer.js 와 PostPage.js 합치기
-	[ ] FileManagePage.js 에서 ReactDOM.render() 삭제
	-	[ ] Component를 list에 push할 필요 없음. React document list,key 참고
	-	[ ] React.createElement() 사용 UX
-	[ ] LoginBanner.js 다시 구성. 최상위에서 props 으로 email 관리