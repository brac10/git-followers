var github = (function () {

    function apiCall(url, username, callback) {
        $.ajax({
            url: url,
            headers: {
                'Authorization': 'Basic ' + btoa(username),
                'Accept': 'application/vnd.github.v3+json'
            },
            method: 'GET',
            success: callback,
            statusCode: {
                403: function(request) {
                    alert(request.responseJSON.message)
                }
            },
            error: function (request, textStatus, errorThrow) {
                console.log('err: ' + request.responseText)
                // alert('Page Error! \n' +errorThrow)
            }
        })
    }

    function autocomplete(request, callback) {
        var url = "https://api.github.com/search/users?per_page=10&q=" + request.term
        apiCall(url, 'user', callback)
    }

    function getFollowers(username, link, callback) {
        var url = 'https://api.github.com/users/' + username + '/followers'
        if (link) {
            url = link
        }
        apiCall(url, username, function (data, textStatus, request) {
            var links = request.getResponseHeader('Link')
            if (links) {
                links = links.split(',')
                data.links = links    
                data.lastPageLink = links[1].split(';')[0].replace(/[\<\>]/g, '')

                var nextLink = null
                for (i=0;i<links.length;i++){
                    var rel = links[i].split(';')[1].split('=')[1].replace(/\"/g, '')
                    if (rel === 'next') nextLink = links[i].split(';')[0].replace(/[\<\>\s]/g, '')
                }
                data.nextLink = nextLink    
            }
            callback(data)
        })    
    }

    return {
        autocomplete: autocomplete,
        getFollowers: getFollowers
    } 
}())