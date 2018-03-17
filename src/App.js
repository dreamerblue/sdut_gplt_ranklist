import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import {Grid, Row, Table, Modal} from 'react-bootstrap';
import config from './config.js';


class App extends Component {
	render() {
		return (
			<Grid className="App">
				<Row>
					<div className="logo"></div>
					<Ranklist/>
					<div className="footer text-center">
						<p>Designed by <a className="bLue" href="https://dreamer.blue" target="_blank"
										  rel="noopener noreferrer">bLue</a></p>
						<p>Special Thanks to <a href="https://github.com/MeiK-h" target="_blank"
												rel="noopener noreferrer">MeiK</a> & 一十</p>
						<p><a href="https://github.com/dreamerblue/sdut_gplt_ranklist" target="_blank"
							  rel="noopener noreferrer">View on GitHub</a></p>
					</div>
				</Row>
			</Grid>
		);
	}
}

class Ranklist extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	fetchData() {
		axios({
			method: 'get',
			url: config.dataURL + '?_t=' + Date.now(),
			timeout: config.requestTimeout,
		}).then(function (response) {
			this.setState(response.data);
			let teamMap = new Map();
			for(let team of response.data.ranklist) {
				teamMap.set(team.team_id, team);
			}
			this.setState({teamMap: teamMap});
			if(response.data.contest_ended === true) {
				this.cancelFetchData();
			}
		}.bind(this)).catch(function (error) {
			console.log(error);
		});
	}

	cancelFetchData() {
		clearInterval(this.refreshTimer);
	}

	componentDidMount() {
		this.refreshTimer = setInterval(
			() => this.fetchData(),
			config.requestInterval
		);
		this.fetchData();
	}

	componentWillUnmount() {
		this.cancelFetchData();
	}

	onShowTeamDetail(teamID) {
		this.setState({
			currentTeamID: teamID
		});
		this.teamDetailComponent.handleShow();
	}

	render() {
		const ranklistRows = [];
		if(this.state.ranklist) {
			for(let team of this.state.ranklist) {
				for(let award of config.awardLevel) {
					if(team.rank <= award.lastRank) {
						team.awardClass = award.className;
						break;
					}
				}
				ranklistRows.push(
					<RanklistRow key={team.team_id}
								 awardClass={team.awardClass}
								 rank={team.rank}
								 teamID={team.team_id}
								 teamName={team.team_name}
								 teamScore={team.team_score}
								 college={team.team_college}
								 stuClass={team.team_class}
								 onShowTeamDetail={this.onShowTeamDetail.bind(this)}/>
				);
			}
		}
		return (
			<div className="Ranklist">
				<Table hover>
					<thead>
					<tr>
						<th>排名</th>
						<th>总分</th>
						<th>队伍</th>
						<th>学院 - 班级</th>
					</tr>
					</thead>
					<tbody>
					{ranklistRows}
					</tbody>
				</Table>
				<TeamDetail teamDetail={this.state.teamMap && this.state.teamMap.get(this.state.currentTeamID)}
							problemSet={this.state.problem_set}
							ref={teamDetailComponent => this.teamDetailComponent = teamDetailComponent}/>
			</div>

		);
	}
}

class RanklistRow extends Component {
	render() {
		return (
			<tr className={this.props.awardClass} onClick={this.props.onShowTeamDetail.bind(this, this.props.teamID)}>
				<td>{this.props.rank}</td>
				<td>{this.props.teamScore}</td>
				<td>{this.props.teamName}</td>
				<td>{this.props.college}{this.props.stuClass ? ` - ${this.props.stuClass}` : ''}</td>
			</tr>
		);
	}
}

class TeamDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false
		};
	}

	handleShow = () => {
		this.setState({show: true});
	};

	handleHide = () => {
		this.setState({show: false});
	};

	render() {
		const teamDetail = this.props.teamDetail || {team_name: '', team_score: 0, members: []};
		const problemSet = this.props.problemSet || [];
		let members = [];
		let max_score = Math.max.apply(null, teamDetail.members.map(member => member.member_score));
		teamDetail.members.forEach(function (value, index) {
			let isMVP = max_score > 0 && value.member_score === max_score;
			members.push(<TeamDetailMemberScoreTable key={index}
													 memberName={value.member_class + ' ' + value.member_name}
													 memberScore={value.member_score}
													 scoreTable={value.scores}
													 isMVP={isMVP}/>);
		});
		return (
			<div>
				<Modal
					show={this.state.show}
					onHide={this.handleHide}
					animation={false}
					bsClass="TeamDetail modal"
				>
					<Modal.Header closeButton>
						<Modal.Title>{teamDetail.team_name}（团队总分：{teamDetail.team_score}）</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table hover>
							<thead>
							<tr>
								<th>队员</th>
								<th>总分</th>
								<TeamDetailProblemSet problemSet={problemSet}/>
							</tr>
							</thead>
							<tbody>
							{members}
							</tbody>
						</Table>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}

class TeamDetailProblemSet extends Component {
	render() {
		return this.props.problemSet.map(
			(problemLabel, index) => <th key={index}>{problemLabel}</th>
		);
	}
}

class TeamDetailMemberScoreTable extends Component {
	render() {
		return (
			<tr>
				<td>{this.props.memberName}{this.props.isMVP ? <span className="mvp">MVP</span> : ''}</td>
				<td>{this.props.memberScore}</td>
				{
					this.props.scoreTable.map(
						(score, index) => <td key={index}>{score}</td>
					)
				}
			</tr>
		);
	}
}

export default App;
