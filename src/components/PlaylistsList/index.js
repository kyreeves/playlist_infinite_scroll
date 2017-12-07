import React from 'react'
import qwest from 'qwest'
// import axios from 'axios'

import { get } from './axiosRequester.js'
import InfiniteScroll from '../InfiniteScroll/index.js'
import { AXIOS_ROUTE, QWEST_ROUTE, REQUEST_PATH, QWEST_DEFAULT_HEADERS } from './constants.js'

export class PlaylistCardsList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      hasMore: true,
      nextHref: null,
    }
  }

  handleLoadMore = page => {
    let requestURL = REQUEST_PATH
    if(this.state.nextHref != null) {
      requestURL = this.state.nextHref
    }

    switch(this.props.location.pathname) { 
      case QWEST_ROUTE: { 
        this.loadWithQwest(requestURL)
        break
      }
      case AXIOS_ROUTE: { 
        this.loadWithAxios(requestURL)
        break 
      }
      default: {
        console.log("Invalid choice")
        break
     }
    }
  }

  loadWithQwest(requestURL) {
    var self = this;
    qwest.get(
      requestURL,
      null,
      QWEST_DEFAULT_HEADERS
    )
    .then(function(xhr, resp) {
      if(resp) {
        const newCards = self.state.cards.concat(resp.data)
        if(resp.links.next) {
          self.setState({
            cards: newCards,
            nextHref: resp.links.next
          })
        } else {
          self.setState({
            cards: newCards,
            nextHref: null,
            // hasMore: false
          })
        }
      }
    })
  }

  loadWithAxios(requestURL) {
    get(requestURL)
      .then(response => {
        const newCards = this.state.cards.concat(response.data)
        if(response.links.next) {
          this.setState({
            cards: newCards,
            nextHref: response.links.next
          })
        } else {
          this.setState({
            cards: newCards,
            nextHref: null,
            // hasMore: false
          })
        }
      })
    }

  // loadWithAxios(requestURL) {
  //   var self = this;
  //   axios.get(requestURL, {
  //     headers: REQUEST_HEADER,
  //     data: {}
  //   })
  //   .then(function(resp) {
  //     if(resp.data) {
  //       if(resp.data.links.next) {
  //         self.setState({
  //           cards: self.state.cards.concat(resp.data.data),
  //           nextHref: resp.data.links.next
  //         })
  //       } else {
  //         self.setState({
  //           nextHref: null
  //         })
  //       }
  //     }
  //   })
  // }

  render() {
    var items = [];
    this.state.cards.map((track, i) => {
        items.push(
          <div className="track" key={i}>
              <a href={""} target="_blank">
                  <img src={track.attributes.pic.url} width="150" height="150" />
                  <p className="title">{track.attributes.name}</p>
              </a>
          </div>
        );
    });

    return(
      <InfiniteScroll
        hasMore={this.state.hasMore}
        loadMore={this.handleLoadMore}
      >
        <div className="tracks">
          {items}
        </div>
      </InfiniteScroll>
    )
  }
}

export default PlaylistCardsList