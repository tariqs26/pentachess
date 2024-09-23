function Space(_x, _y, _angle, _colour) constructor {
	
	// x and y are coordinates of 'right arm'
	x = _x;
	y = _y;
	
	// angle is assuming that 'arms' pointing up is 0
	angle = _angle;
	
	// Default colour is used to go back after changing colour
	default_colour = _colour;
	colour = default_colour;
	
	// Pointers, to be set from the control object
	next_edge_n = noone; // Next (counter-clockwise) edge-adjacent space
	prev_edge_n = noone; // Previous (clockwise) edge-adjacent space
	in_edge_n = noone;   // Inner edge-adjacent space (if exists)
	out_edge_n = noone;  // Outer edge-adjacent space (if exists)
	
	next_vert_n = noone; // Next (counter-clockwise) vertex-adjacent space of the same colour
	prev_vert_n = noone; // Previous (clockwise) vertex-adjacent space of the same colour
	in_vert_n = noone;   // Inner vertex-adjacent space in straight line (only used for bishop & queen) (if exists)
	out_vert_ns = [];    // Outer vertex-adjacent space(s) in straight line (only used for bishop & queen)
	inout_vert_ns = [];  // All vertex-adjacent spaces in other circles
	
	same_vert_ns = []    // All vertex-adjacent spaces in this circle
	
	side_length = 60; // In pixels
	
	// Create the 3 triangles that make up the pentagon
	triangles = [];
	var x1, y1, x2, y2, x3, y3;
	
	x1 = x;
	y1 = y;
	
	x2 = x1 + lengthdir_x(side_length, 252 + angle);
	y2 = y1 + lengthdir_y(side_length, 252 + angle);
	
	x3 = x1 + lengthdir_x(side_length, 216 + angle);
	y3 = y1 + lengthdir_y(side_length, 216 + angle);
	
	array_push(triangles, [x1, y1, x2, y2, x3, y3]);
	
	x1 = x2 + lengthdir_x(side_length, 180 + angle);
	y1 = y2 + lengthdir_y(side_length, 180 + angle);
	
	array_push(triangles, [x1, y1, x2, y2, x3, y3]);
	
	x2 = x1 + lengthdir_x(side_length, 108 + angle);
	y2 = y1 + lengthdir_y(side_length, 108 + angle);
	
	array_push(triangles, [x1, y1, x2, y2, x3, y3]);
	
	step = function() {
		
		// If this piece is clicked, simulate the currently selected piece's available moves
		if (mouse_check_button_pressed(mb_left) && point_inside(mouse_x, mouse_y)) {
			colour = c_red;
			
			var spaces = [];
			switch (global.piece) {
				case PIECE.ROOK:
					spaces = rook_move();
					break;
				case PIECE.BISHOP:
					spaces = bishop_move();
					break;
				case PIECE.KING:
					spaces = king_move();
					break;
				case PIECE.QUEEN:
					spaces = queen_move();
					break;
				case PIECE.KNIGHT:
					spaces = knight_move();
					break;
				case PIECE.PAWN_C:
					spaces = pawn_move(true);
					break;
				case PIECE.PAWN_CC:
					spaces = pawn_move(false);
					break;
				case PIECE.SOLDIER_C:
					spaces = soldier_move(true);
					break;
				case PIECE.SOLDIER_CC:
					spaces = soldier_move(false);
					break;
			}
			
			for (var i = 0; i < array_length(spaces); i ++) {
				spaces[i].colour = (spaces[i].default_colour == c_white) ? c_yellow : c_orange;
			}
		}
		if (mouse_check_button_released(mb_left)) {
			colour = default_colour;
		}
	}
	
	draw = function() {
		
		var width = 3;
		
		draw_set_colour(colour);
		draw_triangle(triangles[0][0], triangles[0][1], triangles[0][2],
			triangles[0][3], triangles[0][4], triangles[0][5], false);
		draw_set_colour(c_black);
		draw_line_width(triangles[0][0], triangles[0][1], triangles[0][2], triangles[0][3], width);
		draw_line_width(triangles[0][0], triangles[0][1], triangles[0][4], triangles[0][5], width);
		
		draw_set_colour(colour);
		draw_triangle(triangles[1][0], triangles[1][1], triangles[1][2],
			triangles[1][3], triangles[1][4], triangles[1][5], false);
		draw_set_colour(c_black);
		draw_line_width(triangles[1][0], triangles[1][1], triangles[1][2], triangles[1][3], width);
		
		draw_set_colour(colour);
		draw_triangle(triangles[2][0], triangles[2][1], triangles[2][2],
			triangles[2][3], triangles[2][4], triangles[2][5], false);
		draw_set_colour(c_black);
		draw_line_width(triangles[2][0], triangles[2][1], triangles[2][2], triangles[2][3], width);
		draw_line_width(triangles[2][2], triangles[2][3], triangles[2][4], triangles[2][5], width);
		
	}
	
	rook_move = function() {
		
		var spaces = [];
		
		// Move in or out
		if (in_edge_n != noone) {
			array_push(spaces, in_edge_n);
		}
		if (out_edge_n != noone) {
			array_push(spaces, out_edge_n);
		}
		
		// Move around
		var temp = next_edge_n;
		while (temp != self) {
			array_push(spaces, temp);
			temp = temp.next_edge_n;
		}
		temp = prev_edge_n;
		while (temp != self && temp != spaces[array_length(spaces) - 1]) {
			array_push(spaces, temp);
			temp = temp.prev_edge_n;
		}
		
		return spaces;
		
	}
	
	bishop_move = function() {
		
		var spaces = [];
		
		// Move in and out
		var inout_spaces = filter_colour(inout_vert_ns, true);
		spaces = array_concat(spaces, inout_spaces);
		
		// Straight lines
		if (in_vert_n != noone && in_vert_n.in_vert_n != noone) {
			array_push(spaces, in_vert_n.in_vert_n);
		}
		for (var i = 0; i < array_length(out_vert_ns); i ++) {
			for (var j = 0; j < array_length(out_vert_ns[i].out_vert_ns); j ++) {
				array_push(spaces, out_vert_ns[i].out_vert_ns[j]);
			}
		}
		
		// Move around
		var temp = next_vert_n;
		while (temp != self) {
			array_push(spaces, temp);
			temp = temp.next_vert_n;
		}
		temp = next_vert_n;
		while (temp != self && temp != spaces[array_length(spaces) - 1]) {
			array_push(spaces, temp);
			temp = temp.next_vert_n;
		}
		
		return spaces;
		
	}
	
	king_move = function() {
		
		var spaces = [next_edge_n, prev_edge_n, next_vert_n, prev_vert_n];
		
		if (in_edge_n != noone) {
			array_push(spaces, in_edge_n);
		}
		if (out_edge_n != noone) {
			array_push(spaces, out_edge_n);
		}
		
		var inout_spaces = filter_colour(inout_vert_ns, true);
		spaces = array_concat(spaces, inout_spaces);
		
		return spaces;
		
	}
	
	queen_move = function() {
		return array_union(rook_move(), bishop_move());
	}
	
	knight_move = function() {
		
		var spaces = [];
		
		var inout_spaces = filter_colour(inout_vert_ns, false);
		spaces = array_concat(spaces, inout_spaces);
		
		var same_spaces = filter_colour(same_vert_ns, false);
		spaces = array_concat(spaces, same_spaces);
		
		// Remove edge-ajacent spaces
		spaces = array_filter(spaces, function(e, i) {
			return e != out_edge_n && e != in_edge_n && e != next_edge_n && e != prev_edge_n;
		});
		
		return spaces;
		
	}
	
	pawn_move = function(clockwise) {
		
		// TODO: add capturing, blocking, first move
		
		var spaces = [];
		
		if (clockwise) {
			array_push(spaces, prev_edge_n);
		}
		else {
			array_push(spaces, next_edge_n);
		}
		
		// Move in or out
		if (in_edge_n != noone) {
			array_push(spaces, in_edge_n);
		}
		if (out_edge_n != noone) {
			array_push(spaces, out_edge_n);
		}
		
		return spaces;
		
	}
	
	soldier_move = function(clockwise) {
		
		// TODO: add capturing, blocking, first move
		
		var spaces = [];
		
		if (clockwise) {
			array_push(spaces, prev_vert_n);
		}
		else {
			array_push(spaces, next_vert_n);
		}
		
		// Move in and out
		var inout_spaces = filter_colour(inout_vert_ns, true);
		spaces = array_concat(spaces, inout_spaces);
		
		return spaces;
		
	}
	
	point_inside = function(_x, _y) {
		
		return (
			point_in_triangle(mouse_x, mouse_y, triangles[0][0], triangles[0][1],
				triangles[0][2], triangles[0][3], triangles[0][4], triangles[0][5]) ||
			point_in_triangle(mouse_x, mouse_y, triangles[1][0], triangles[1][1],
				triangles[1][2], triangles[1][3], triangles[1][4], triangles[1][5]) ||
			point_in_triangle(mouse_x, mouse_y, triangles[2][0], triangles[2][1],
				triangles[2][2], triangles[2][3], triangles[2][4], triangles[2][5]));
		
	}
	
	filter_colour = function(arr, same) {
		if (same) {
			f = function(e, i) {
				return e.default_colour == default_colour;
			}
		}
		else {
			f = function(e, i) {
				return e.default_colour != default_colour;
			}
		}
		return array_filter(arr, f);
	}
	
}