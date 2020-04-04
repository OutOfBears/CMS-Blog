import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

class Pagination extends React.Component {
    paginate = (e) => {
        const { limit } = this.props;
        var num = e.target.value;

        this.props.updateIndex(Number(num) * limit, false);
    }

    paginateEvent = (action = 0) => (e) => {
        var { index, limit, total } = this.props;

        switch(action){
            case 1:
                index += limit;
                break;
            case 2:
                index -= limit;
                break;
            default: 
                break;
        }

        if(index < total && index >= 0) {
            //this.updatePosts()
            this.props.updateIndex(index, true);
        }
        
    }

    render() {
        const { 
            limit,
            total,
            index
        } = this.props;

        const pages = Math.ceil(total / limit); 
        const currentPage = Math.floor(index / limit) + 1;

        return (
            <div id="pagination">
                <button onClick={this.paginateEvent(2)}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span>
                    <input
                        type="number" 
                        value={currentPage}
                        onChange={this.paginate}
                        onBlur={this.paginateEvent(0)}
                    />
                    <> out of {pages}</>
                </span>
                <button onClick={this.paginateEvent(1)}>
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        );
    }
}
  
export default Pagination;