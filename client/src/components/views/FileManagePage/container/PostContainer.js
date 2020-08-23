import React from 'react';
import {Link} from 'react-router-dom';

export default class PostContainer extends React.Component {
	
	render() {
		const title = this.props.title;
		const contents = this.props.contents;
		const onClickHandler = this.props.onClickHandler;

		return (
			<div className='post-page-body'>
				<div>
					<p className="subject-font">파일명</p>
					<hr />
					<p id="title">{title}</p>
					<hr />
				</div>

				<div>
					<p className="subject-font">내용</p>
					<hr />
					{contents}
					<hr />
				</div>

				<div>
					<button type="button" className="btn btn-primary" onClick={onClickHandler}>
						수정하기
					</button>
					<Link to='/file'>
						<button type="button" className="btn btn-secondary">
							취소
						</button>
					</Link>
				</div>
			</div>
		);
	}
}