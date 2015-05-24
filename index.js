function parseViewBox( value ) {
    var viewBox = value.split( /[, ]+/ )
    return viewBox.map( function( val ) {
	return isNaN( val ) ? 0 : parseFloat( val )
    } )
}

$.fx.step['viewBox'] = function( fx ) {
    var attr = fx.elem.attributes.getNamedItem( 'viewBox' )
    if( ! fx.set ) {
	fx.start = parseViewBox( attr ? attr.nodeValue : '' )
	fx.end = parseViewBox( fx.end )
	fx.set = true
    }

    var box = $.map( fx.start, function( n, i ) {
	return ( n + fx.pos * ( fx.end[i] - n ) )
    }).join(' ')

    ;(attr ? attr.nodeValue = box : fx.elem.setAttribute( 'viewBox', box ) )
}

$( function() {
    var $map = $('#map')
    var $areas = $('<ul/>')
    var areas = {}
    var lastArea
	    
    $('#menu').append( $areas )

    $map.on( 'load', function() {
	$('[class="area"]', $map[0].contentDocument).each( function() {
	    function Area( elem ) {
		this.$elem = $(elem)
		this.id = this.$elem.attr( 'id' )
		this.name = this.id
		    .replace( /-/g, ' ' )
		    .replace( /(?:^|\s)\S/g, function( a ) {
			return a.toUpperCase()
		    } )
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
	    
	    area.$elem.click( function() {
		var elem = this
		var svg = elem.ownerDocument.documentElement
		var newBox

		var area = areas[$(elem).attr( 'id' )]

		if( $('body').hasClass( 'highlighted' ) && area == lastArea ) {
		    $('body').removeClass( 'highlighted' )

		    var bbox = svg.getBBox()
		    newBox = [ bbox.x, bbox.y, bbox.width, bbox.height ]
		} else {
		    $('body').addClass( 'highlighted' )

		    var bbox = elem.getBBox()
		
		    var tfm2elm = elem.getTransformToElement( svg )
		    
		    var pad = 50
		    
		    var origin = svg.createSVGPoint()
		    origin.x = bbox.x - pad
		    origin.y = bbox.y - pad
		    
		    var dest = svg.createSVGPoint()
		    dest.x = origin.x + bbox.width + 2 * pad
		    dest.y = origin.y + bbox.height + 2 * pad
		    
		    origin = origin.matrixTransform(tfm2elm)
		    dest = dest.matrixTransform(tfm2elm)
		    
		    dest.x -= origin.x
		    dest.y -= origin.y
		
		    newBox = [ origin.x, origin.y, dest.x, dest.y ]
		}
		
		$(svg).animate( { viewBox: newBox.join( ' ' ) } )
		
		lastArea = area
	    } )
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
