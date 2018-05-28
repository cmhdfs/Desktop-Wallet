import React, { Component } from 'react';
import { connect } from 'react-redux';
import { filter, sortBy } from 'lodash';

import { loadWitnesses } from '../../actions/witnesses';
import { MoreIcon, WalletIcon, DownloadIcon } from '../Icons';

import Header from '../ContentPrimaryHeader';
import Vote from './Vote';

import styles from './VoteList.css';

class VoteList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterValue: '',
      witnesses: this.props.witnesses
    }
  }

  filterTokens = (e) => {
    console.log('input', e.target)
    console.log(this.props.witnesses);
    let filtered = this.props.witnesses.filter((witness) =>{
      return witness.url.toLowerCase().includes(e.target.value.toLowerCase());
    });

    this.setState({
      witnesses: filtered,
    });
  }

  componentDidMount() {
    this.props.loadWitnesses();
  }

  renderWitnesses() {
    let { searchString } = this.props;
    let { witnesses } = this.state;
    console.log(searchString)
    witnesses = filter(witnesses, w => w.url.toUpperCase().indexOf(searchString) !== -1);
    witnesses = sortBy(witnesses, w => w.url);

    return (
      <div className={styles.votesContainer}>
        { witnesses.length < 1 ? (<div className={styles.noResults}>No Witnesses Found</div>) : '' }
        {
          witnesses.map((rep, index) =>
            <Vote
              key={index}
              voteLabel={index + 1}
              voteTitle={rep.url}
              lastBlock={rep.latestblocknum}
              blocksProduced={rep.totalproduced}
              blocksMissed={rep.totalmissed}
              totalVote={rep.votecount}
            />)
        }
      </div>
    );
  }

  render() {

    let { witnesses } = this.props;

    return (
      <div className={styles.container}>
        <Header className={styles.header} text="REPRESENTATIVE LISTING :" />
        <input className={styles.input} placeholder="Search for a Witness here..." onChange={this.filterTokens}/>
        {this.renderWitnesses()}
      </div>
    );
  }
}

export default connect(
  state => ({ witnesses: state.witnesses.witnesses, searchString: state.app.searchString }),
  dispatch => ({
    loadWitnesses: () => {
      dispatch(loadWitnesses(dispatch));
    }
  })
)(VoteList);
