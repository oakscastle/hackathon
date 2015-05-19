$( function() {
    var $map = $('#map')
    var $areas = $('<ul/>')
    var areas = {}
    
    $('#menu').append( $areas )

    $map.on( 'load', function() {
	console.log( $map[0].contentDocument )
	$('[class="area"]', $map[0].contentDocument).each( function() {
	    function Area( elem ) {
		this.$elem = $(elem)
		this.id = this.$elem.attr( 'id' )
		this.name = this.id
		    .replace( /-/g, ' ' )
		    .replace( /(?:^|\s)\S/g, function( a ) {
			return a.toUpperCase()
		    } )
		console.log( this.name )
		this.$item = $('<li/>')
		    .text( this.name )
		    .data( { id: this.id } )
		$areas.append( this.$item )
	    }

	    var area = new Area( this )

	    areas[area.id] = area
	    
	    function hovered( id ) {
		var area = areas[id]
		
		area.$elem.attr( 'active', 'true' )
		area.$item.attr( 'active', 'true' )
		$('#area').text( area.name )
		$('#area').css( { opacity: 1 } )
	    }
	    
	    function left( id ) {
		var area = areas[id]
		
		area.$elem.removeAttr( 'active' )
		area.$item.removeAttr( 'active' )
		$('#area').css( { opacity: 0 } )
		$('#area').text( '' )
	    }

	    area.$item.hover(
		function() { hovered( $(this).data( 'id' ) ) },
		function() { left( $(this).data( 'id' ) ) }
	    )

	    area.$elem.hover(
		function() { hovered( $(this).attr( 'id' ) ) },
		function() { left( $(this).attr( 'id' ) ) }
	    )
	} )
    } )

    var slideout = new Slideout( {
	panel: document.getElementById( 'panel' ),
	menu: document.getElementById( 'menu' ),
	padding: 160,
	tolerance: 70
    } )

    slideout.open()

    $('.toggle-button').click( function() {
	slideout.toggle()
    } )

    //$('#schedule').accordion()
} )
