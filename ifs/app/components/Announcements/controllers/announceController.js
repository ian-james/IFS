const path = require ('path');
const viewPath = path.join(__components, 'Announcements/views/');

const createAnnounce = (req, res) => {
  /* Validate input */
  
  /* Save to databsae */

  /* Alert user (redirect to announcement view?) */
};

const updateAnnounce = (req, res) => {
  /* Validate Input */

  /* update database based on Id (check ownership?)*/

  /* Alert user (redirect to announcement view?) */
};

const deleteAnnounce = (req, res) => {
  /* Check ownership of announcement */
  /* Delete */
};

const getAnnounce = (req, res) => {
  /* Get specific announcement */
  /* Redirect to specific announcement view */
};

const getAnnounces = (req, res) => {
  /* Get all announcements (within range?  Pagination) for specific user */
  /* Redirect to all announcement view */
  res.render('./../views/announcements', {});
};

module.exports.getAnnounces = getAnnounces;