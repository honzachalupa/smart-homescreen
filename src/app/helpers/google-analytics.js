import ReactGA from 'react-ga';
import { _isProdEnvironment } from 'Helpers/environment';
// import { _isTestUser } from 'Helpers/authentication';

const isTestUser = false; // _isTestUser();
const googleAnalyticsId_Dev = 'UA-47064928-4';
const googleAnalyticsId_Prod = 'UA-130179464-1';
let isInitialized = false;

const initialize = (userNumber) => {
    if (navigator.onLine) {
        const googleAnalyticsId =
            _isProdEnvironment() && !isTestUser ?
                googleAnalyticsId_Prod :
                googleAnalyticsId_Dev;

        ReactGA.initialize(googleAnalyticsId, { debug: isTestUser });

        if (isTestUser) {
            console.log(`[react-ga] initialized, userId: ${userNumber}`);
        }

        ReactGA.set({ userId: userNumber });

        isInitialized = true;
    }
};

const logPageView = () => {
    if (navigator.onLine) {
        if (!isInitialized) {
            window.location.reload();
        } else {
            ReactGA.pageview(window.location.pathname);
        }
    }
};

export default {
    initialize,
    logPageView
};
