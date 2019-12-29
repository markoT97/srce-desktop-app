const { ipcRenderer } = window;
const { channels } = window;

export const FETCH_VOLUNTEERS_PENDING = 'FETCH_VOLUNTEERS_PENDING';
export const FETCH_VOLUNTEERS_SUCCESS = 'FETCH_VOLUNTEERS_SUCCESS';
export const FETCH_VOLUNTEERS_ERROR = 'FETCH_VOLUNTEERS_ERROR';

export function fetchVolunteersPending() {
    return {
        type: FETCH_VOLUNTEERS_PENDING
    };
}

export function fetchVolunteersSuccess(volunteers, numberOfPages) {
    return {
        type: FETCH_VOLUNTEERS_SUCCESS,
        items: volunteers,
        numberOfPages: numberOfPages
    };
}

export function fetchVolunteersError(error) {
    return {
        type: FETCH_VOLUNTEERS_ERROR,
        error: error
    };
}

function fetchVolunteers(offset, limit) {
    return async dispatch => {
        dispatch(fetchVolunteersPending());
        await new Promise(resolve => {
            ipcRenderer.send(channels.GET_VOLUNTEERS, {
                offset: offset,
                limit: limit
            });
            ipcRenderer.once(channels.GET_VOLUNTEERS, (event, result) => {
                let numberOfPages = Math.floor(result.count / limit);
                result.count % limit > 0
                    ? (numberOfPages += 1)
                    : (numberOfPages += 0);

                resolve({
                    volunteers: result.volunteers,
                    numberOfPages: numberOfPages
                });
            });
        })
            .then(result => {
                dispatch(
                    fetchVolunteersSuccess(
                        result.volunteers,
                        result.numberOfPages
                    )
                );
            })
            .catch(error => dispatch(fetchVolunteersError(error)));
    };
}

export default fetchVolunteers;
