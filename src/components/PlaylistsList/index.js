import React from 'react'
import qwest from 'qwest'

import InfiniteScroll from '../InfiniteScroll/index.js'

const PATH = "https://staging-api.soundstripe.com/v1/curated_playlists?page%5Blimit%5D=8"
const QWEST_PATH = "/qwest"
const AXIOS_PATH = "/axios"

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
    let requestURL = PATH
    if(this.state.nextHref != null) {
      requestURL = this.state.nextHref
    }

    switch(this.props.location.pathname) { 
      case QWEST_PATH: { 
        this.loadWithQwest(requestURL)
        break
      }
      case AXIOS_PATH: { 
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
    qwest.get(requestURL, null, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      responseType: 'json'
    })
    .then(function(xhr, resp) {
      if(resp) {
        if(resp.links.next) {
          self.setState({
            cards: self.state.cards.concat(resp.data),
            nextHref: resp.links.next
          })
        } else {
          self.setState({
            nextHref: null
          })
        }
      }
    })
  }

  loadWithAxios(requestURL) {
    var self = this;
    qwest.get(requestURL, null, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      },
      responseType: 'json'
    })
    .then(function(xhr, resp) {
      if(resp) {
        if(resp.links.next) {
          self.setState({
            cards: self.state.cards.concat(resp.data),
            nextHref: resp.links.next
          })
        } else {
          self.setState({
            nextHref: null
          })
        }
      }
    })
  }

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