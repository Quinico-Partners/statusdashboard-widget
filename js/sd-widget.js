/* 

  StatusDashboard Widget JavaScript 

  Author: Tom Alessi

  Copyright: 2019 Quinico Partners, LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

*/



// User Configuration Settings
var color_operational = '#4CAF50';
var status_operational = 'Operational';
var color_incident = '#F44336';
var status_incident = 'Incident';
var color_maintenance = "#2196F3";
var status_maintenance = "Maintenance"
var domain = 'https://status.statusdashboard.com';
var records = 5;
var debug = false;
// End User Configuration Settings



// Paginators
var next;
var previous;

// Initial query Url
var query_url = `${domain}/api/v1/dashboard/?limit=${records}`;
    
// Register the click handlers
// 'next' and 'previous' will get updated on every API call
$("#sd-next").click(function() {
  refresh(next);
});
$("#sd-previous").click(function() {
  refresh(previous);
});

// Fetch the requested data from the API and return.
// refresh() will wait until the data has been returned (done) before
// updating the page.
function getAPI(url) {
  if (debug) {console.log(`Fetching ${url}`);}
  return $.getJSON(url);
}

// Called on page load, and whenever 'next' or 'previous are called'
function refresh(url) {
    
    // Show the loading spinner
    $(".sd-spinner").show();

    getAPI(url).done(function(data) {
            
      // Create the ul
      var ul = '<ul class="list-group">';

      for (i = 0; i < data.objects.length; i++) {
        // Set the operational colors
        if (data.objects[i]['status'] == 'operational') {
          color = color_operational;
          status = status_operational;
        } else if (data.objects[i]['status'] == 'active incident') {
          color = color_incident;
          status = status_incident;
        } else if (data.objects[i]['status'] == 'active maintenance') {
          color = color_maintenance;
          status = status_maintenance;
        }
        ul += `<li class="list-group-item d-flex justify-content-between align-items-center">${data.objects[i]['service_name']}<span class="badge badge-primary badge-pill" style="background-color:${color}">${status}</span></li>`;
      }

      // Close the ul
      ul += '</ul>'
  
      // Update the status container with the refreshed <ul>
      $("#status-container").html(ul);
      // The page is updated, so hide the spinner
      $(".sd-spinner").hide();           

      // If there's a next/previous, set the navigation links to whatever
      // the API returned.  If the respective link is null, then hide the navigation link
      if (data.meta['next']) {
        if (debug) {console.log(`Next: ${data.meta['next']}`)}
        next = `${domain}${data.meta['next']}`;
        $("#sd-next").show();
      } else {
        // There are no next records, so set next to undefined and hide the associated navigational element
        next = null;
        $("#sd-next").hide();
      }
      if (data.meta['previous']) {
        if (debug) {console.log(`Previous: ${data.meta['previous']}`)}
        previous = `${domain}${data.meta['previous']}`;
        $("#sd-previous").show();
      } else {
        // There are no previous records, so set previous to undefined and hide the associated navigational element
        previous = null;
        $("#sd-previous").hide();
      }
      if (debug) {console.log('getAPI exit');};
  }).fail(function(e) {
    if (debug) {console.log(`Error fetching status: ${e.status}`);}
    // Hide the loading spinner
    $(".sd-spinner").hide();           
  });
}

// Refresh the <ul> on page load
refresh(query_url);

if (debug) {console.log('Script exit');}

