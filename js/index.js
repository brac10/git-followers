var pages = null
var username = ''

$(document).ready(function () {
    
    $('.load-more').hide()
    $('.searchbox button').on('click touch', searchHandler)
    $('.searchbox').submit(searchHandler)

    $('.load-more').click(function (e) {
        $(this).addClass('load-more--loading')
    })
})

$("#search").autocomplete({
    source: function (request, response) {
        github.autocomplete(request, function (data) {
            response($.map(data.items, function (item) {
                    return {
                        label: item.login,
                        value: item.login
                    }
            }))
        })
    },
    select: function (event, ui) {
        // $('.load-wrap').show()
        setTimeout(function(){
            searchHandler(event)
        }, 300)
    },
    open: function(event, ui) {
        $('ul.ui-autocomplete').hide().fadeIn(300)
        $('.ui-autocomplete').off('menufocus hover mouseover mouseenter')
    },
    close: function () {
        $('ul.ui-autocomplete').show().fadeOut(300)
        
    }
}).keyup(function (e) {
    if(e.which === 13) {
        $('ul.ui-autocomplete').show().fadeOut(300)
    }
})



var searchHandler = function(e){
    e.preventDefault();
    username = $('#search').val() 
    $('#avatar-display').children().remove()
    $('.load-more').hide()
    pages = null
    github.getFollowers(username, null, avatarPreview)
}

var avatarPreview = function (data) {
    $('.load-wrap').show()
    // check for provided header links
    if (data.links) {        
        // check if we already count followers
        if (!pages) countFollowers(data.lastPageLink)
        else $('.load-wrap').hide()
        
        // check if next link is provided
        if (data.nextLink)
            $('.load-more').show().attr('onclick', 'github.getFollowers(\'' + username + '\', \'' + data.nextLink + '\', avatarPreview)')
        else
            $('.load-more').hide()
    } else {
        updateFollowersCount(data.length)
        $('.load-more').hide()
    }

    // build html
    $.each(data, function (i, follower) {
        var name = follower.login
        var avatar = follower.avatar_url

        var htmlBlock = '<div class="follower" style="background-image: url(\'' + avatar + '\')" ><h4>' + name + '</h4></div>'
        $(htmlBlock).appendTo('#avatar-display')
    });

    $('.load-more--loading').removeClass('load-more--loading')
}

var countFollowers = function(link){
    pages = parseInt(link.split('=')[1]);
    github.getFollowers(username, link, function(data) {
        var lastPageLength = data.length
        var followersNumber = pages * 30 + lastPageLength
        updateFollowersCount(followersNumber)
    })
} 

var updateFollowersCount = function(count){
    $('#follower-count').text(username + ', You have ' + count + ' followers')
    if (count > 1000) 
        $('#follower-comment').text('Wow !!! That\'s impressive... Keep up the good work!')
    else 
        $('#follower-comment').text('Not bad! Keep believing... One day you\'ll have thousands of them.')
    $('.load-wrap').hide()
}