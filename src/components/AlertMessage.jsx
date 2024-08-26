import PropTypes from 'prop-types'
import { GoAlertFill } from "react-icons/go"

const AlertMessage = ({ text }) => {
    return (
        <div className="alert-message">
            <GoAlertFill/>
            <p>{ text }</p>
        </div>
    )
}

AlertMessage.propTypes = {
    text: PropTypes.isRequired
}

export default AlertMessage