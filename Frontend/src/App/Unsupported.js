import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';

class Unsupported extends React.Component {
    render() {
        return (
            <div id="unsupported">
                <FontAwesomeIcon icon={faFrown} />
                Yikes!
                <span>It seems like this device is not supported</span>
            </div>
        );
    }
}
  
export default Unsupported;