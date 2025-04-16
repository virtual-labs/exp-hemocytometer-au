 /** Directive function will call onload */
(function(){
  angular
       .module('users')
	   .directive("experiment",directiveFunction)
})();

var hemocytometer_stage,binocular_container,trinocular_container,tick,monitor_mask,binocular_mask,binocular_light_intensity;
var binocular_cell_light_intensity,monitor_scale,binocular_scale,left_right_value,cell_in_monitor_x,cell_in_monitor_y;
var top_down_value,mechanical_small_stageup_value,mechanical_stageup_value,blur_filter,initial_blur_value,intensity_flag;
var current_binocular_cell_alpha,alpha_count,cells_needed,viable_cells_value,original_volume,cell_container,binocular_cell_container;
var color_light_array = circle_array = [];

/** Directive function starts here */
function directiveFunction(){
	return {
		restrict: "A",
		link: function(scope, element,attrs){
			/** Variable that decides if something should be drawn on mouse move */
			var experiment = true;
			if ( element[0].width > element[0].height ) {
				element[0].width = element[0].height;
				element[0].height = element[0].height;
			} else {
				element[0].width = element[0].width;
				element[0].height = element[0].width;
			}  
			if ( element[0].offsetWidth > element[0].offsetHeight ) {
				element[0].offsetWidth = element[0].offsetHeight;			
			} else {
				element[0].offsetWidth = element[0].offsetWidth;
				element[0].offsetHeight = element[0].offsetWidth;
			}
			/** Load images */
			queue = new createjs.LoadQueue(true);
			queue.installPlugin(createjs.Sound);
			queue.on("complete", handleComplete, this);
			queue.loadManifest([{
				id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
            }, {
				id:"slide", 
				src:"././images/slide.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"switch_off", 
				src:"././images/switch_off.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"switch_on", 
				src:"././images/switch_on.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"push_button_on", 
				src:"././images/push_button_on.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"push_button_off", 
				src:"././images/push_button_off.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"zoomin_big_up_arrow", 
				src:"././images/zoomin_big_up_arrow.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"zoomout_big_down_arrow", 
				src:"././images/zoomout_big_down_arrow.svg",
				type:createjs.LoadQueue.IMAGE},
			{
				id:"zoomin_small_up_arrow", 
				src:"././images/zoomin_small_up_arrow.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"zoomout_small_down_arrow", 
				src:"././images/zoomout_small_down_arrow.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"arrow_rod", 
				src:"././images/arrow_rod.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"binocular_view", 
				src:"././images/binocular_view.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"switch_zoom_off", 
				src:"././images/switch_zoom_off.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"switch_zoom_on", 
				src:"././images/switch_zoom_on.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"Push_button_zoom_off", 
				src:"././images/push_button_zoom_off.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"Push_button_zoom_on", 
				src:"././images/push_button_zoom_on.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"Intensity_arrow", 
				src:"././images/intensity_arrow.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"black_rod_big", 
				src:"././images/black_rod_big.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"turner_zoom", 
				src:"././images/turner_zoom.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"black_rod_big_arrow", 
				src:"././images/black_rod_big_arrow.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"zoomin_top_arrow", 
				src:"././images/zoomin_top_arrow.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"zoomout_down_arrow", 
				src:"././images/zoomout_down_arrow.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"zoomin_rotate", 
				src:"././images/zoomin_rotate.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"zoomout_rotate", 
				src:"././images/zoomout_rotate.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"rotate_line_small1", 
				src:"././images/rotate_line_small1.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"rotate_line_small2", 
				src:"././images/rotate_line_small2.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"blue_light", 
				src:"././images/blue_light.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"green_light", 
				src:"././images/green_light.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"yellow_light", 
				src:"././images/yellow_light.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"red_light", 
				src:"././images/red_light.svg",
				type:createjs.LoadQueue.IMAGE
			}, {
				id:"monitor_cells", 
				src:"././images/monitor_cells.svg",
				type:createjs.LoadQueue.IMAGE
			}]);
					
			hemocytometer_stage = new createjs.Stage("demoCanvas"); /** Stage creation */
			hemocytometer_stage.enableDOMEvents(true);
			createjs.Touch.enable(hemocytometer_stage);
			hemocytometer_stage.enableMouseOver(10);
            tick = setInterval(updateTimer, 100); /** Stage update function in a timer */

			trinocular_container = new createjs.Container(); /** Container for adding monitor view of the experiment to the stage */	
			trinocular_container.name = "trinocular_container";
			hemocytometer_stage.addChild(trinocular_container); /** Append it in the stage */

            binocular_cell_container = new createjs.Container(); /** Binocular view of container for adding cells view of experiment to the stage */
			binocular_cell_container.name = "binocular_cell_container";
			hemocytometer_stage.addChild(binocular_cell_container);/** Append it in the stage */ 
			binocular_cell_container.x=180;
			binocular_cell_container.y=100;
			binocular_cell_container.width=330;
			binocular_cell_container.height=250;
			
            binocular_container = new createjs.Container(); /** Container for adding binocular view of experiment to the stage */
			binocular_container.name = "binocular_container";
			hemocytometer_stage.addChild(binocular_container);/** Append it in the stage */ 
			
            cell_container = new createjs.Container(); /** Container for adding cells view of experiment to the stage */
			cell_container.name = "cell_container";
			hemocytometer_stage.addChild(cell_container);/** Append it in the stage */ 
			cell_container.x=485;
			cell_container.y=450;
			cell_container.width=150;
			cell_container.height=140;

			monitor_mask = new createjs.Shape(); /** New shape for monitor cell mask */
			binocular_mask = new createjs.Shape(); /** New shape for binocular cell mask */
			blur_filter = new createjs.BlurFilter(initial_blur_value); /** Adding blur functionality to the cells in the monitor */
			binocular_light_intensity = new createjs.Shape(); /** This shape is used to display the light intensity of the microscope */
			binocular_cell_light_intensity = new createjs.Shape();

			function handleComplete(){
				/** Loading images */
				loadImages(queue.getResult("background"),"background",-32,-45,1.05,trinocular_container,"");
				loadImages(queue.getResult("blue_light"),"blue_light",154,258,1.03,trinocular_container,"");
				loadImages(queue.getResult("green_light"),"green_light",154,258,1.03,trinocular_container,"");
				loadImages(queue.getResult("yellow_light"),"yellow_light",154,258,1.03,trinocular_container,"");
				loadImages(queue.getResult("red_light"),"red_light",154,258,1.03,trinocular_container,"");
				loadImages(queue.getResult("slide"),"slide",210,410,1,trinocular_container,"");				
				loadImages(queue.getResult("switch_off"),"switchOff",160,623,1,trinocular_container,"pointer");
				loadImages(queue.getResult("switch_on"),"switchOn",160,623,1,trinocular_container,"pointer");
				loadImages(queue.getResult("push_button_off"),"push_button_off",148,616,1,trinocular_container,"pointer");
				loadImages(queue.getResult("push_button_on"),"push_button_on",148,616,1,trinocular_container,"pointer");
				loadImages(queue.getResult("zoomin_rotate"),"zoomin_rotate",216,580,1,trinocular_container,"");
				loadImages(queue.getResult("zoomout_rotate"),"zoomout_rotate",216,580,1,trinocular_container,"");
				loadImages(queue.getResult("rotate_line_small1"),"zoom_in_rotate_small",235,590,1,trinocular_container,"");
				loadImages(queue.getResult("rotate_line_small2"),"zoom_out_rotate_small",235,590,1,trinocular_container,"");
				createRect("monitorRect",439.5,442.5,246,153,"white","white",trinocular_container);
				loadImages(queue.getResult("monitor_cells"),"bino_monitor_cells",350,230,.78,binocular_container,"");				
				
				monitor_mask.graphics.beginStroke("").drawRect(439.5,442.5,246,153); /** Creates a rectangle for masking the zoom of images */
				trinocular_container.addChild(monitor_mask); /** Adding that rectangle to the container */ 				
				binocular_mask.graphics.beginStroke("").drawRect(2,0,697,466); /** Creates a rectangle for masking the zoom of images */
				binocular_container.addChild(binocular_mask); /** Adding that rectangle to the container */				
				binocular_light_intensity.graphics.beginFill("#FFFFFF").drawRect(2, 0, 697, 466); /** Filling white color into for light intensity effect  */
				binocular_container.addChild(binocular_light_intensity); /** Adding that rectangle to the container */ 
				createRect("binocular_light_On_Off",2, 0, 697, 466,"black","black",binocular_container);				
				binocular_light_intensity.alpha = current_binocular_cell_alpha; /** Setting the light intensity alpha value, current_binocular_cell_alpha=0 */
				loadImages(queue.getResult("zoomin_big_up_arrow"),"zoomin_big_up_arrow",228,588,1,trinocular_container,"pointer");
				loadImages(queue.getResult("zoomout_big_down_arrow"),"zoomout_big_down_arrow",221,610,1,trinocular_container,"pointer");
				loadImages(queue.getResult("zoomin_small_up_arrow"),"zoomin_small_up_arrow",244,595,1.4,trinocular_container,"pointer");
				loadImages(queue.getResult("zoomout_small_down_arrow"),"zoomout_small_down_arrow",240,613,1.3,trinocular_container,"pointer");
				loadImages(queue.getResult("arrow_rod"),"arrow_rod_up_right",349,570,1.9,trinocular_container,"pointer");
				loadImages(queue.getResult("arrow_rod"),"arrow_rod_up_left",338,578,1.9,trinocular_container,"pointer");
				loadImages(queue.getResult("arrow_rod"),"arrow_rod_down_right",348,594,1.3,trinocular_container,"pointer");
				loadImages(queue.getResult("arrow_rod"),"arrow_rod_down_left",340,600,1.3,trinocular_container,"pointer");
				loadImages(queue.getResult("monitor_cells"),"monitor_cells",560,520,.35,trinocular_container,"");
				loadImages(queue.getResult("binocular_view"),"binocular_view",0,0,1,binocular_container,"");	
				createRect("binocular_light_on_rect",0, 0, 700, 460,"black","black",binocular_container);
				loadImages(queue.getResult("switch_zoom_off"),"switch_zoom_off",60,545,1,binocular_container,"pointer");	
				loadImages(queue.getResult("switch_zoom_on"),"switch_zoom_on",60,545,1,binocular_container,"pointer");
				loadImages(queue.getResult("Push_button_zoom_off"),"Push_button_zoom_off",190,550,1,binocular_container,"pointer");
				loadImages(queue.getResult("Push_button_zoom_on"),"Push_button_zoom_on",190,550,1,binocular_container,"pointer");
				loadImages(queue.getResult("Intensity_arrow"),"Intensity_arrow_up",335,560,1,binocular_container,"pointer");
				loadImages(queue.getResult("Intensity_arrow"),"Intensity_arrow_down",373,643,1,binocular_container,"pointer");
				loadImages(queue.getResult("black_rod_big"),"black_rod_zoom",450,540,.8,binocular_container,"");
				loadImages(queue.getResult("turner_zoom"),"turner_zoom",570,540,.8,binocular_container,"");
				loadImages(queue.getResult("black_rod_big_arrow"),"black_rod_up_right_arrow",492,575,1,binocular_container,"pointer");
				loadImages(queue.getResult("black_rod_big_arrow"),"black_rod_up_left_arrow",472,590,1,binocular_container,"pointer");
				loadImages(queue.getResult("black_rod_big_arrow"),"black_rod_down_right_arrow",492,635,1,binocular_container,"pointer");
				loadImages(queue.getResult("black_rod_big_arrow"),"black_rod_down_left_arrow",472,650,1,binocular_container,"pointer");
				loadImages(queue.getResult("zoomin_top_arrow"),"zoomin_top_arrow",603,560,1,binocular_container,"pointer");
				loadImages(queue.getResult("zoomout_down_arrow"),"zoomout_top_arrow",587,603,1,binocular_container,"pointer");
				loadImages(queue.getResult("zoomin_top_arrow"),"zoomin_down_arrow",635,580,.7,binocular_container,"pointer");
				loadImages(queue.getResult("zoomout_down_arrow"),"zoomout_down_arrow",623,616,.7,binocular_container,"pointer");
				/** Adding the label to the binocular controls */
                setText("systemOn_OFF", 25, 515, _("System on/Off"), "#000000", 1, binocular_container);
                setText("lightOn_OFF", 170, 515, _("Light on/Off"), "#000000", 1, binocular_container);
                setText("light_intensity", 285, 515, _("Light intensity"), "#000000", 1, binocular_container);
                setText("turning", 395, 515, _("Left and Right turning"), "#000000", 1, binocular_container);
                setText("zoom", 570, 515, _("Zoom In/Out"), "#000000", 1, binocular_container);
				trinocular_container.getChildByName("switchOff").visible =trinocular_container.getChildByName("zoomin_rotate").visible=false;
				trinocular_container.getChildByName("push_button_on").alpha = 0.01;
				binocular_container.getChildByName("binocular_light_on_rect").alpha = binocular_container.getChildByName("binocular_light_On_Off").alpha = 0;
				initialisationOfVariables(); /** Initializing the variables */
				initialisationOfImages();
				translationLabels(); /** Translation of strings using gettext */

				color_light_array = ["blue_light", "red_light", "green_light", "yellow_light"]; /** Light image names in an array */
				circle_array = ["blue_circle", "red_circle", "green_circle", "yellow_circle"]; /** Circle buttons in an array */

				cell_container.mask = monitor_mask; /** Cell container masking */
				binocular_cell_container.mask = binocular_mask; /** Binocular cell container masking */

				/** Hemocytometer push button off function */
				trinocular_container.getChildByName("push_button_on").on("mousedown", function(evt) {					
					trinocular_container.getChildByName("push_button_on").alpha = 1;
				});
				/** Push button on function */
				trinocular_container.getChildByName("push_button_on").on("pressup", function(evt) {
					trinocular_container.getChildByName("push_button_on").alpha = 0.01;
				});
				/** Hemocytometer power on function */
				trinocular_container.getChildByName("switchOn").on("click", function() {
					binocular_container.getChildByName("Push_button_zoom_on").alpha = 0;
                    binocular_container.getChildByName("Push_button_zoom_off").alpha = 1;
                    binocular_container.getChildByName("bino_monitor_cells").alpha = 0;
                    trinocular_container.getChildByName("monitorRect").alpha = 0;
					trinocular_container.getChildByName("monitor_cells").alpha = 0;
					binocular_container.getChildByName("binocular_light_On_Off").alpha = 1;
					trinocular_container.getChildByName("red_light").alpha = 0;
					trinocular_container.getChildByName("switchOff").visible = true;
					trinocular_container.getChildByName("switchOn").visible = false;
					cell_container.alpha = 0;
					binocular_cell_container.alpha = 0;
				});
				/** Hemocytometer power off function */
				trinocular_container.getChildByName("switchOff").on("click", function() {
					binocular_container.getChildByName("Push_button_zoom_off").alpha = 0;
                    binocular_container.getChildByName("Push_button_zoom_on").alpha = 1;
                    binocular_container.getChildByName("bino_monitor_cells").alpha = 1;
					binocular_container.getChildByName("binocular_light_On_Off").alpha = 0 ;
					trinocular_container.getChildByName("switchOff").visible = false;
					trinocular_container.getChildByName("switchOn").visible = true;
					trinocular_container.getChildByName("red_light").alpha = 1;					
					checkMonitorView(); 
				});
				/** Blue light on functionality */
				trinocular_container.getChildByName("blue_circle").on("click", function() {
					for ( var i=0; i<4; i++ ) {
						trinocular_container.getChildByName(circle_array[i]).alpha=0.01;
						trinocular_container.getChildByName(color_light_array[i]).visible=false;
					}
					trinocular_container.getChildByName("blue_circle").alpha=0.5;
					trinocular_container.getChildByName("blue_light").visible=true;
				});
				/** Red light on functionality */
				trinocular_container.getChildByName("red_circle").on("click", function() {
					for ( var i=0; i<4; i++ ) {
						trinocular_container.getChildByName(circle_array[i]).alpha=0.01;
						trinocular_container.getChildByName(color_light_array[i]).visible=false;
					}
					trinocular_container.getChildByName("red_circle").alpha=0.5;
					trinocular_container.getChildByName("red_light").visible=true;
				});
				/** Green light on functionality */
				trinocular_container.getChildByName("green_circle").on("click", function() {
					for ( var i=0; i<4; i++ ) {
						trinocular_container.getChildByName(circle_array[i]).alpha=0.01;
						trinocular_container.getChildByName(color_light_array[i]).visible=false;
					}
					trinocular_container.getChildByName("green_circle").alpha=0.5;
					trinocular_container.getChildByName("green_light").visible=true;
				});
				/** Yellow light on functionality */
				trinocular_container.getChildByName("yellow_circle").on("click", function() {
					for ( var i=0; i<4; i++ ) {
						trinocular_container.getChildByName(circle_array[i]).alpha=0.01;
						trinocular_container.getChildByName(color_light_array[i]).visible=false;
					}
					trinocular_container.getChildByName("yellow_circle").alpha=0.5;
					trinocular_container.getChildByName("yellow_light").visible=true;
				});
				/** Slide move down function */
				trinocular_container.getChildByName("arrow_rod_up_right").on("pressup", function(evt) {
					left_right_value += 5; /** Increment variable value for moving slide up */
					trinocular_container.getChildByName("monitor_cells").y = cell_in_monitor_y + left_right_value; /** Assigns the incremented value to the y position of cells */
					cell_container.y = cell_container.y + 4.7;
					trinocular_container.getChildByName("arrow_rod_up_left").mouseEnabled = true; /** Enabling click functionality of move down arrow */
					trinocular_container.getChildByName("slide").y = trinocular_container.getChildByName("slide").y + 0.3; /** Move up slide */
					if ( left_right_value == 150 ) { /** Disable click of slide move up arrow when incremented value reaches 22 */
						trinocular_container.getChildByName("arrow_rod_up_right").mouseEnabled = false; /** Disable click of move up arrow */
					}
				});
				/** Slide move up function */
                trinocular_container.getChildByName("arrow_rod_up_left").on("pressup", function(evt) {
                    left_right_value -= 5; /** Decrement variable value for moving slide up */
                    trinocular_container.getChildByName("monitor_cells").y = cell_in_monitor_y + left_right_value; /** Assigns the decremented value to the y position of cells */
                    cell_container.y = cell_container.y - 4.7;
                    trinocular_container.getChildByName("slide").y = trinocular_container.getChildByName("slide").y - 0.3; /** Move down slide */
                    trinocular_container.getChildByName("arrow_rod_up_right").mouseEnabled = true; /** Enabling click functionality of move down arrow */
                    if ( left_right_value <= -150 ) { /** Disable click of slide move up arrow when decremented value reaches -22 */
                        trinocular_container.getChildByName("arrow_rod_up_left").mouseEnabled = false; /** Disable click of move down arrow */
                    }
                });
				/** Slide move right function */
                trinocular_container.getChildByName("arrow_rod_down_right").on("pressup", function(evt) {
                    top_down_value += 5; /** Increment variable value for moving slide right */
                    trinocular_container.getChildByName("monitor_cells").x = cell_in_monitor_x + top_down_value; /** Assigns the incremented value to the x position of cells */
                    cell_container.x = cell_container.x + 5;
                    trinocular_container.getChildByName("slide").x = trinocular_container.getChildByName("slide").x + 0.3; /** Move right slide */
                    trinocular_container.getChildByName("arrow_rod_down_left").mouseEnabled = true; /** Enabling click functionality of move left arrow */
                    if ( top_down_value == 200 ) { /** Disable click of slide move right arrow when incremented value reaches 25 */
                        trinocular_container.getChildByName("arrow_rod_down_right").mouseEnabled = false; /** Disable click of move right arrow */
                    }
                });
				/** Slide move left function */
                trinocular_container.getChildByName("arrow_rod_down_left").on("pressup", function(evt) {
                    top_down_value -= 5; /** Decrement variable value for moving slide left */
                    trinocular_container.getChildByName("monitor_cells").x = cell_in_monitor_x + top_down_value; /** Assigns the decremented value to the x position of cells */
                    cell_container.x = cell_container.x - 5;
                    trinocular_container.getChildByName("arrow_rod_down_right").mouseEnabled = true; /** Enabling click functionality of move right arrow */
                    trinocular_container.getChildByName("slide").x = trinocular_container.getChildByName("slide").x - 0.3; /** Move left slide */
                    if ( top_down_value <= -200 ) { /** Disable click of slide move left arrow when decremented value reaches -25 */
                        trinocular_container.getChildByName("arrow_rod_down_left").mouseEnabled = false;
                    }
                });                
				/** Mechanical stage movement big -Up  */
				trinocular_container.getChildByName("zoomin_big_up_arrow").on("pressup", function(evt) {
					blurUpArrowFunction(); /**Calling the blurUpArrowFunction */
				});
				/** Mechanical stage movement big -Down */
				trinocular_container.getChildByName("zoomout_big_down_arrow").on("pressup", function(evt) {
					blurDownArrowFunction(); /**Calling the blurDownArrowFunction */
				});
				/** Mechanical stage movement small - Up */
                trinocular_container.getChildByName("zoomin_small_up_arrow").on("pressup", function(evt) {
					blurUpSmallArrowFunction(); /**Calling the blurUpSmallArrowFunction */
                });
				/** Mechanical stage movement small - Down */
                trinocular_container.getChildByName("zoomout_small_down_arrow").on("pressup", function(evt) {
					blurDownSmallArrowFunction(); /**Calling the blurDownSmallArrowFunction */
                });
				/** Binocular system off function */
				binocular_container.getChildByName("switch_zoom_on").on("pressup", function(evt) {
					binocular_container.getChildByName("switch_zoom_on").alpha = 0;
                    binocular_container.getChildByName("switch_zoom_off").alpha = 1;
                    binocular_container.getChildByName("binocular_light_on_rect").alpha = 1;
				    trinocular_container.getChildByName("monitorRect").alpha = 0;
				    trinocular_container.getChildByName("monitor_cells").alpha = 0;
				    cell_container.alpha = 0;
					binocular_cell_container.alpha = 0;
                });
				/** Binocular system on function */
                binocular_container.getChildByName("switch_zoom_off").on("pressup", function(evt) {
                    binocular_container.getChildByName("switch_zoom_off").alpha = 0;
                    binocular_container.getChildByName("switch_zoom_on").alpha = 1;
                    binocular_container.getChildByName("binocular_light_on_rect").alpha = 0;
					checkMonitorView();
                });
				/** Binocular button off function */
                binocular_container.getChildByName("Push_button_zoom_on").on("pressup", function(evt) {
					binocular_container.getChildByName("Push_button_zoom_on").alpha = 0;
                    binocular_container.getChildByName("Push_button_zoom_off").alpha = 1;
                    binocular_container.getChildByName("bino_monitor_cells").alpha = 0;
                    trinocular_container.getChildByName("monitorRect").alpha = 0;
					trinocular_container.getChildByName("monitor_cells").alpha = 0;
					binocular_container.getChildByName("binocular_light_On_Off").alpha = 1;
					trinocular_container.getChildByName("red_light").alpha = 0;
					trinocular_container.getChildByName("switchOff").visible = true;
					trinocular_container.getChildByName("switchOn").visible = false;
					cell_container.alpha = 0;
					binocular_cell_container.alpha = 0;
                });
				/** Binocular button on function */
                binocular_container.getChildByName("Push_button_zoom_off").on("pressup", function(evt) {
					binocular_container.getChildByName("Push_button_zoom_off").alpha = 0;
                    binocular_container.getChildByName("Push_button_zoom_on").alpha = 1;
                    binocular_container.getChildByName("bino_monitor_cells").alpha = 1;
					checkMonitorView();
					binocular_container.getChildByName("binocular_light_On_Off").alpha = 0 ;
					trinocular_container.getChildByName("switchOff").visible = false;
					trinocular_container.getChildByName("switchOn").visible = true;
					trinocular_container.getChildByName("red_light").alpha = 1;
                });					
				/** Binocular light Intensity-up Arrow functionality */
                binocular_container.getChildByName("Intensity_arrow_up").on("pressup", function(evt) {
                	binocular_container.getChildByName("Intensity_arrow_down").mouseEnabled = true; /** Enabling the second light intensity arrow */
                    if ( alpha_count.toFixed(1) == 0 && intensity_flag == true ) {
						binocular_light_intensity.graphics.beginFill("#FFFFFF").drawRect(0, 0, 700, 460); /** Drawing a white rectangle for light intensity - Up Arrow */
                    }
                    alpha_count += 0.1; /** Counting the click */
                    binocular_light_intensity.alpha = alpha_count.toFixed(1); /** Setting the alpha values using the mouse-click */
                    current_binocular_cell_alpha = alpha_count.toFixed(1)
                    intensity_flag = false;
                    if ( alpha_count.toFixed(1) < -0.1 ) {
                        binocular_light_intensity.alpha = Math.abs(alpha_count.toFixed(1));
                        current_binocular_cell_alpha = Math.abs(alpha_count.toFixed(1))
                    }
                    if ( alpha_count.toFixed(1) == 0 ) {
                        intensity_flag = true ;
                    }
                    /** Stop the click functionality of up arrow*/
                    if ( alpha_count.toFixed(1) == 1.0 ) {
                        binocular_container.getChildByName("Intensity_arrow_up").mouseEnabled = false;
                    }
				});
				/** Binocular light Intensity-up Arrow functionality */
				binocular_container.getChildByName("Intensity_arrow_down").on("pressup", function(evt) {
					binocular_container.getChildByName("Intensity_arrow_up").mouseEnabled = true;
                    alpha_count -= 0.1;
                    binocular_light_intensity.alpha = alpha_count.toFixed(1);
                    current_binocular_cell_alpha = alpha_count.toFixed(1);
                    if ( alpha_count.toFixed(1) == -0.1 ) {
                        binocular_light_intensity.graphics.beginFill("#000000").drawRect(0, 0, 700, 460);
                    }
                    if ( alpha_count.toFixed(1) < -0.1 ) {
                        binocular_light_intensity.alpha = Math.abs(alpha_count.toFixed(1));
                        current_binocular_cell_alpha = Math.abs(alpha_count.toFixed(1));
                    }
                    /** Stop the click functionality of down arrow */
                    if ( alpha_count.toFixed(1) == -0.9 ) {
                        binocular_container.getChildByName("Intensity_arrow_down").mouseEnabled = false;
                    }                  
				});
				/** Binocular Small Controller move-up functionality */
                binocular_container.getChildByName("black_rod_up_left_arrow").on("pressup", function(evt) {
                    binocular_container.getChildByName("black_rod_up_right_arrow").mouseEnabled = true;
                    binocular_container.getChildByName("bino_monitor_cells").y -= 4; /** Changing the position of the binocular cells */
                    binocular_cell_container.y -= 4;
                    if ( binocular_container.getChildByName("bino_monitor_cells").y == -90 ) {
                        binocular_container.getChildByName("black_rod_up_left_arrow").mouseEnabled = false;
                    }
                });
				/** Binocular Small Controller move-down functionality */
                binocular_container.getChildByName("black_rod_up_right_arrow").on("pressup", function(evt) {
                    binocular_container.getChildByName("black_rod_up_left_arrow").mouseEnabled = true;
                    binocular_container.getChildByName("bino_monitor_cells").y += 4; /** Changing the position of the binocular cells */
                    binocular_cell_container.y += 4;
                    if ( binocular_container.getChildByName("bino_monitor_cells").y == 554 ) {
                        binocular_container.getChildByName("black_rod_up_right_arrow").mouseEnabled = false;
                    }
                });
				/** Binocular Small Controller move-left functionality */
                binocular_container.getChildByName("black_rod_down_left_arrow").on("pressup", function(evt) {
                    binocular_container.getChildByName("black_rod_down_right_arrow").mouseEnabled = true;
                    binocular_container.getChildByName("bino_monitor_cells").x -= 4; /** Changing the position of the binocular cells */
                    binocular_cell_container.x -= 4;
                    if ( binocular_container.getChildByName("bino_monitor_cells").x == -118 ) {
                        binocular_container.getChildByName("black_rod_down_left_arrow").mouseEnabled = false;
                    }
                });
				/** Binocular Small Controller move-right functionality */
                binocular_container.getChildByName("black_rod_down_right_arrow").on("pressup", function(evt) {
                    binocular_container.getChildByName("black_rod_down_left_arrow").mouseEnabled = true;
                    binocular_container.getChildByName("bino_monitor_cells").x += 4; /** Changing the position of the binocular cells */
                    binocular_cell_container.x += 4;
                    if ( binocular_container.getChildByName("bino_monitor_cells").x == 834 ) {
                        binocular_container.getChildByName("black_rod_down_right_arrow").mouseEnabled = false;
                    }
                });
				/** Binocular blur functionality large-Up */
                binocular_container.getChildByName("zoomin_top_arrow").on("pressup", function(evt) {
                    blurUpArrowFunction(); /** Calling the  blurUpArrowFunction function to the large arrows in the binocular. */
                });
				/** Binocular blur functionality large-down */
                binocular_container.getChildByName("zoomout_top_arrow").on("pressup", function(evt) {
                    blurDownArrowFunction(); /** Calling the  blurDownArrowFunction function to the large arrows in the binocular. */
                });
				/** Mechanical stage movement small - Up */
                binocular_container.getChildByName("zoomin_down_arrow").on("pressup", function(evt) {
                    blurUpSmallArrowFunction(); /** Calling the blurUpSmallArrowFunction */
                });
				/** Mechanical stage movement small - down */
                binocular_container.getChildByName("zoomout_down_arrow").on("pressup", function(evt) {
                    blurDownSmallArrowFunction(); /** Calling the blurDownSmallArrowFunction */
                });
				createDynamicCells(); /** Creating dynamic cells */
				createDynamicCellsBinocular(); /** Creating dynamic cells for binocular view */			
			}

			/** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */	
			function translationLabels(){
                /** This help array shows the hints for this experiment */
				helpArray = [_("help1"),_("help2"),_("help3"),_("Next"),_("Close")];
                scope.heading = _("Hemocytometer-Counting of cells");
				scope.variables = _("Variables");                				
				scope.copyright = _("copyright");
				scope.change_view_lbl = _("Binocular View");
				scope.selectLense_label = _("Select Lense");
				scope.selectLense_Placeholder = _("10X");
				scope.no_of_squares_cnt = _("No: of squares counted");
				scope.cell_viablty_lbl = _("Percentage cell viability");
				scope.total_cells_lbl = _("Total Cells");
				scope.total_cells = 0;
				scope.percent_viabity_lbl = _("% Cell viability");
				scope.percent_viability = 0;
				scope.cell_concentration_lbl = _("Concentration of cells");
				scope.avg_cell_viable_lbl = _("Avg viable cell count/sq");
				scope.avg_viable_cells = 0;
				scope.cell_viable_lbl = _("Viable Cells/ml");
				scope.viable_cells = 0;
				scope.sample_volume_lbl = _("Original volume of sample");
				scope.sample_vol = 1 + _("  ml");
				scope.tot_viable_cell_lbl = _("Total viable cells/Sample");
				scope.total_viable_cell_sampl = 0;
				scope.viable_cell_count = _("Viable cell count");
				scope.dead_cell_count = _("Dead cell count");
				scope.media_volume_lbl =_("Volume of media needed");
				scope.num_cells_lbl = _("Number of cells needed");
				scope.media_volume_lbl = _("Volume of media needed");
				scope.media_volume = 0 + "  μ";
				scope.Square1 = _("square1");
				scope.Square2 = _("square2");
				scope.Square3 = _("square3");
				scope.Square4 = _("square4");
				scope.Square5 = _("square5");
				scope.Total = _("Total");
				/** Initializing the table values with 0 */
				scope.sqr41_viable = 0;
				scope.sqr42_viable = 0;
				scope.sqr43_viable = 0;
				scope.sqr44_viable = 0;
				scope.totalViable = 0;
				scope.sqr41_dead = 0;
				scope.sqr42_dead = 0;
				scope.sqr43_dead = 0;
				scope.sqr44_dead = 0;
				scope.totaldead = 0;
				scope.sqr51_viable =  0;
				scope.sqr52_viable = 0; 
				scope.sqr53_viable =  0;
				scope.sqr54_viable =  0;				
				scope.sqr55_viable = 0;
				scope.sqr5totalViable = 0;
				scope.sqr51_dead =  0;
				scope.sqr52_dead =  0;
				scope.sqr53_dead =  0;
				scope.sqr54_dead =  0;
				scope.sqr55_dead = 0; 
				scope.sqr5totalDead =0;
				scope.needCells = 0;
				scope.selectLenseArray = [{ /** Add items to drop down menu */
                    optionsLense: _('10X'),
                    type: 0
                }, {
                    optionsLense: _('40X'),
                    type: 1
                }, {
                    optionsLense: _('100X'),
                    type: 2
                }];
				scope.$apply();	
			}			
		}
	}
}
/** Createjs stage updation happens in every interval */
function updateTimer() {
    hemocytometer_stage.update(); /** Stage updation */
}
/** Binocular view function */
function checkMonitorView(){
	if(binocular_container.getChildByName("switch_zoom_on").alpha == 1) {
		trinocular_container.getChildByName("monitorRect").alpha = 1;
		trinocular_container.getChildByName("monitor_cells").alpha = 1;
		cell_container.alpha = 1;
		binocular_cell_container.alpha = 1;
	} else {
		trinocular_container.getChildByName("monitorRect").alpha = 0;
		trinocular_container.getChildByName("monitor_cells").alpha = 0;
		cell_container.alpha = 0;
		binocular_cell_container.alpha = 0;						
	}
}
/** Applying blur effect to the cells */
function blurCells(blur_value, blur_cells_name, blur_image_width, blur_image_height){
	blur_value = Math.abs(blur_value); /** Take positive blur values */
	blur_filter = new createjs.BlurFilter(blur_value); /** Create new blur filter */
	blur_cells_name.filters = [blur_filter];
	blur_cells_name.cache(0, 0, blur_image_width, blur_image_height);
}
/** Function for enabling and disabling  the first section of arrows in both microscope and binocular view. */
function firstSectionArrowOnOff(on_off_value){ 
	trinocular_container.getChildByName("zoomin_big_up_arrow").mouseEnabled = on_off_value;
	trinocular_container.getChildByName("zoomin_small_up_arrow").mouseEnabled = on_off_value;
	binocular_container.getChildByName("zoomin_top_arrow").mouseEnabled = on_off_value;
	binocular_container.getChildByName("zoomin_down_arrow").mouseEnabled = on_off_value;
}
/** Function for enabling and disabling  the second  section of arrows in both microscope and binocular view. */
function secondSectionArrowOnOff(on_off_value){
	trinocular_container.getChildByName("zoomout_big_down_arrow").mouseEnabled = on_off_value;
	trinocular_container.getChildByName("zoomout_small_down_arrow").mouseEnabled = on_off_value;
	binocular_container.getChildByName("zoomout_top_arrow").mouseEnabled = on_off_value;
	binocular_container.getChildByName("zoomout_down_arrow").mouseEnabled = on_off_value;
}
/** Function for increase the blur effect of the cells in both microscope and binocular. */
function blurUpArrowFunction(){ 
	mechanical_stageup_value ++; /** Counting the mouse click using mechanical stage up value */
	binocular_container.getChildByName("bino_monitor_cells").scaleX += 0.1;
	binocular_container.getChildByName("bino_monitor_cells").scaleY += 0.1;
	binocular_cell_container.scaleX += 0.08;
	binocular_cell_container.scaleY += 0.08;
	trinocular_container.getChildByName("zoomin_rotate").visible = true;
	trinocular_container.getChildByName("zoomout_rotate").visible = false;
	secondSectionArrowOnOff(true); /** Enabling the second section arrows. */
	blurCells(initial_blur_value --,trinocular_container.getChildByName("monitor_cells"), 420, 420); /** Function for blur the monitor cell */
	blurCells(initial_blur_value -=2,binocular_container.getChildByName("bino_monitor_cells"),1000, 1000); /** Function for blur the binocular cell. */
	blurCells(initial_blur_value --,cell_container, 150, 140);
	blurCells(initial_blur_value -=2,binocular_cell_container,330, 250);
	if ( mechanical_stageup_value >= 8 ) { /** After 8 click the first section of the arrows get disable */
		firstSectionArrowOnOff(false); /** Disabling the first section of arrows */
	}
}
/** Function for decrease the blur effect of the cells in both microscope and binocular. */
function blurDownArrowFunction(){
	mechanical_stageup_value--; /** Counting the mouse click using mechanical stage up value */
	binocular_container.getChildByName("bino_monitor_cells").scaleX -= 0.1;
	binocular_container.getChildByName("bino_monitor_cells").scaleY -= 0.1;
	binocular_cell_container.scaleX -= 0.08;
	binocular_cell_container.scaleY -= 0.08;
	trinocular_container.getChildByName("zoomin_rotate").visible = false;
	trinocular_container.getChildByName("zoomout_rotate").visible = true;
	firstSectionArrowOnOff(true); /** Enable the first section arrows */
	blurCells(initial_blur_value ++,trinocular_container.getChildByName("monitor_cells"), 420, 420); /** Function for decrease blur the monitor cell */
	blurCells(initial_blur_value +=2,binocular_container.getChildByName("bino_monitor_cells"),1000, 1000); /** Function for decrease blur the binocular cell. */
	blurCells(initial_blur_value ++,cell_container, 150, 140);
	blurCells(initial_blur_value +=2,binocular_cell_container,330, 250);
	if ( mechanical_stageup_value <= -2 ) { /** After 2 click the first section of the arrows get disable */
		secondSectionArrowOnOff(false); /** Disabling the second section of arrows */
	}
}
/** Function for increase the blur effect of the cells in both microscope and binocular using the small arrows. */
function blurUpSmallArrowFunction(){
	mechanical_small_stageup_value ++; /** Counting the mouse click using mechanical stage up value */
	binocular_container.getChildByName("bino_monitor_cells").scaleX += 0.1;
	binocular_container.getChildByName("bino_monitor_cells").scaleY += 0.1;
	binocular_cell_container.scaleX += 0.08;
	binocular_cell_container.scaleY += 0.08;
	trinocular_container.getChildByName("zoom_out_rotate_small").visible = true;
	trinocular_container.getChildByName("zoom_in_rotate_small").visible = false;
	secondSectionArrowOnOff(true); /** Enable the second section arrows */
	blurCells(initial_blur_value -= 0.2,trinocular_container.getChildByName("monitor_cells"), 420, 420); /** Function for decrease blur the monitor cell */
	blurCells(initial_blur_value-= 1,binocular_container.getChildByName("bino_monitor_cells"),1000, 1000); /** Function for decrease blur the binocular cell. */
	blurCells(initial_blur_value -= 0.2,cell_container, 150, 140);
	blurCells(initial_blur_value-= 1,binocular_cell_container,330, 250);
	if ( mechanical_small_stageup_value >= 13 ) {
		firstSectionArrowOnOff(false); /** Disable the first section arrows */
	}
}
/** Function for decrease the blur effect of the cells in both microscope and binocular using the small arrows. */
function blurDownSmallArrowFunction(){
	mechanical_small_stageup_value --;
	binocular_container.getChildByName("bino_monitor_cells").scaleX -= 0.1;
	binocular_container.getChildByName("bino_monitor_cells").scaleY -= 0.1;
	binocular_cell_container.scaleX -= 0.08;
	binocular_cell_container.scaleY -= 0.08;
	trinocular_container.getChildByName("zoom_out_rotate_small").visible = false;
	trinocular_container.getChildByName("zoom_in_rotate_small").visible = true;
	firstSectionArrowOnOff(true); /** Enable the first section arrows */
	blurCells(initial_blur_value += 0.2,trinocular_container.getChildByName("monitor_cells"), 420, 420); /** Function for decrease blur the monitor cell */
	blurCells(initial_blur_value += 1,binocular_container.getChildByName("bino_monitor_cells"),1000, 1000); /** Function for decrease blur the binocular cell. */
	blurCells(initial_blur_value += 0.2,cell_container, 150, 140);
	blurCells(initial_blur_value += 1,binocular_cell_container,330, 250);
	if ( mechanical_small_stageup_value <= -2 ) {
		secondSectionArrowOnOff(false); /** Disable the first section arrows  */
	}
}
/** Function for changing the lense in the microscope */
function changeLenseFn(scope) {
	var _lens_value = scope.lense_Mdl; /** Get current drop down value */
	if ( _lens_value == 0 ) { /** If 10X lens is selected */		
		cell_container.regX = cell_container.width / 20; /** Scale cells in monitor and binocular */
		cell_container.regY = cell_container.height / 20;
		monitor_scale = 0.35; binocular_scale = 0.78;
		cell_container.scaleX=cell_container.scaleY=1;
		binocular_cell_container.regX = binocular_cell_container.width / 30;
		binocular_cell_container.regY = binocular_cell_container.height / 20;
		binocular_cell_container.scaleX=binocular_cell_container.scaleY=1;
	} else if ( _lens_value == 1 ) { /** If 40X lens is selected */		
		cell_container.regX = cell_container.width / 6; /** Scale cells in monitor and binocular */
		cell_container.regY = cell_container.height / 6;
		monitor_scale = 0.5; binocular_scale = 1.3;
		cell_container.scaleX=cell_container.scaleY=1.4;
		binocular_cell_container.regX = binocular_cell_container.width / 5;
		binocular_cell_container.regY = binocular_cell_container.height / 5;
		binocular_cell_container.scaleX=binocular_cell_container.scaleY=1.7;
	} else { /** If 100X lens is selected */		
		cell_container.regX = cell_container.width / 3.5; /** Scale cells in monitor and binocular */
		cell_container.regY = cell_container.height / 3.5;
		monitor_scale = 0.8; binocular_scale = 2;
		cell_container.scaleX=cell_container.scaleY=2.3;
		binocular_cell_container.regX = binocular_cell_container.width / 4;
		binocular_cell_container.regY = binocular_cell_container.height / 4;
		binocular_cell_container.scaleX=binocular_cell_container.scaleY=2.8;
	}
	trinocular_container.getChildByName("monitor_cells") .scaleY = monitor_scale;	
	trinocular_container.getChildByName("monitor_cells") .scaleX = monitor_scale; 
	binocular_container.getChildByName("bino_monitor_cells") .scaleY = binocular_scale; 
	binocular_container.getChildByName("bino_monitor_cells") .scaleX = binocular_scale; 
}
/** Change between views, monitor view and binocular view */
function changeView(scope){
	if ( scope.change_view_lbl == _("Binocular View") ) { /** If binocular view is selected */
		scope.change_view_lbl = _("Trinocular View");
		binocular_container.visible = true;
		trinocular_container.visible = false;
		cell_container.visible=false;
		binocular_cell_container.visible=true;
	} else { /** If monitor view is selected */
		scope.change_view_lbl =_("Binocular View");
		trinocular_container.visible = true;
		binocular_container.visible = false;
		cell_container.visible=true;
		binocular_cell_container.visible=false;		
	}
}
/** Create rectangle function */
function createRect(name,xPos,yPos,width,height,strokecolr,fillcolr,container){
	var _rect = new createjs.Shape();
	_rect.graphics.setStrokeStyle(0.5);
	_rect.name = name;
	_rect.alpha = 1;	
	_rect.graphics.beginStroke(strokecolr).beginFill(fillcolr).drawRect(xPos,yPos,width,height);
	container.addChild(_rect);
}
/** All variables initialising in this function */
function initialisationOfVariables() {
	trinocular_container.visible = true;
	binocular_container.visible = false;
	cell_container.visible=true;
	binocular_cell_container.visible=false;
	intensity_flag = true;
	left_right_value = 0;
	top_down_value = 0;
	cell_in_monitor_x = 560;
	cell_in_monitor_y = 520;
	mechanical_stageup_value = 0;
	initial_blur_value = 5;
	mechanical_small_stageup_value = 0;
	alpha_count = 0;
	alpha_count_black = 0;
	current_binocular_cell_alpha = 0;
	viable_cells_value = 0;
	cells_needed = 0;
	original_volume = 1;
	monitor_scale = 0.35; 
	binocular_scale = 0.78;
	createCircle("blue_circle",0.01,"darkgrey",193,490,4,trinocular_container); /** Circle created for blue light click */
    createCircle("red_circle",0.01,"darkgrey",191.5,500,4,trinocular_container); /** Circle created for red light click */
    createCircle("yellow_circle",0.01,"darkgrey",190,510,4,trinocular_container); /** Circle created for yellow light click */
    createCircle("green_circle",0.01,"darkgrey",189.5,520,4,trinocular_container); /** Circle created for green light click */
}
/** Function for initialisation of images */
function initialisationOfImages() {
    trinocular_container.getChildByName("blue_light").visible=false;
    trinocular_container.getChildByName("green_light").visible=false;
    trinocular_container.getChildByName("yellow_light").visible=false;
}
/** Load all the images using in the experiment using createjs*/
function loadImages(image,name,xPos,yPos,sFactor,container,cursor){
	var _bitmap = new createjs.Bitmap(image).set({});
	_bitmap.x = xPos;
	_bitmap.y = yPos;
	_bitmap.name = name;
	_bitmap.alpha = 1;
	_bitmap.cursor = cursor;
	_bitmap.scaleX=_bitmap.scaleY = sFactor;	
	if ( name == "arrow_rod_up_left"||name == "arrow_rod_down_left"||name == "Intensity_arrow_down"||
	name == "black_rod_up_left_arrow"||name == "black_rod_down_left_arrow" ) { /** Flip arrow images for controllers */
		_bitmap.scaleX = _bitmap.scaleY = sFactor * -1;
	}	
	if ( name == "monitor_cells" ) { /** Mask the monitor cells and setting registration points */
		_bitmap.mask = monitor_mask;
		_bitmap.regX = _bitmap.image.width / 2;
		_bitmap.regY = _bitmap.image.height / 2;
	}	
	if ( name == "bino_monitor_cells" ) { /** Mask the binocular cells and setting registration points */
		_bitmap.mask = binocular_mask;
		_bitmap.regX = _bitmap.image.width / 2;
		_bitmap.regY = _bitmap.image.height / 2;
	}
	container.addChild(_bitmap);
}
/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container) {
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
    container.addChild(_text); /** Adding text to the container */
}
/** Function for creating circles for easy click of light change */
function createCircle(name,alpha,color,x_val,y_val,radius,container) {
    circle = new createjs.Shape();
    circle.name=name;
    circle.alpha=alpha;
    circle.cursor="pointer";
    circle.graphics.beginFill(color).drawCircle(x_val, y_val, radius);    
    container.addChild(circle);
}
/** Function for creating circles for easy click of light change */
function createStrokeCircle(name,x_val,y_val,radius,container) {
    circle = new createjs.Shape();
    circle.name=name;
    circle.alpha=1;
    circle.cursor="pointer";
    circle.graphics.setStrokeStyle(0.5).beginStroke("#000000").drawCircle(x_val, y_val, radius);    
    container.addChild(circle);
}
/** Function for creating dynamic cells */
function createDynamicCells() {
	for ( i = 0; i <20; i++ ) {				
		var _circle_x=Math.round(Math.random()*(cell_container.width));
		var _circle_y=Math.round(Math.random()*(cell_container.height));
		createCircle("circle1",1,"darkblue",_circle_x,_circle_y,2,cell_container); /** Circle created for dead cells */	
	}
	for ( i = 0; i <80; i++ ) {	
		var _stroke_circle_x=Math.round(Math.random()*(cell_container.width));
		var _stroke_circle_y=Math.round(Math.random()*(cell_container.height));
		createStrokeCircle("circle1",_stroke_circle_x,_stroke_circle_y,2,cell_container); /** Circle created for cells */	
	}	
}
/** Function for creating dynamic cells for binocular view */
function createDynamicCellsBinocular() {
	for ( i = 0; i <20; i++ ) {				
		var _circle_x=Math.round(Math.random()*(binocular_cell_container.width));
		var _circle_y=Math.round(Math.random()*(binocular_cell_container.height));
		createCircle("circle1",1,"darkblue",_circle_x,_circle_y,4,binocular_cell_container); /** Circle created for dead cells */	
	}
	for ( i = 0; i <80; i++ ) {	
		var _stroke_circle_x=Math.round(Math.random()*(binocular_cell_container.width));
		var _stroke_circle_y=Math.round(Math.random()*(binocular_cell_container.height));
		createStrokeCircle("circle1",_stroke_circle_x,_stroke_circle_y,4,binocular_cell_container); /** Circle created for cells */	
	}	
}
/** Calculation part */
/** Find the totals of viable and dead cell for the inputed table values for square 4 */
function findTotalssqr5(scope){
	viable_cells_value = 0;
	cells_needed = 0;
	original_volume = 1;	
	if ( scope.sqr51_viable == "" ) { /** Avoid null values in viable table cells */
		scope.sqr51_viable = 0;
	}  
	if ( scope.sqr52_viable == "" ) {
		scope.sqr52_viable = 0;
	}  
	if ( scope.sqr53_viable == "" ) {
		scope.sqr53_viable = 0;
	}  
	if ( scope.sqr54_viable == "" ) {
		scope.sqr54_viable = 0;
	}  
	if ( scope.sqr55_viable == "" ) {
		scope.sqr55_viable = 0;
	}	
	if ( scope.sqr51_dead == "" ) { /** Avoid null values in the dead table cells */
		scope.sqr51_dead = 0;
	}  
	if ( scope.sqr52_dead == "" ) {
		scope.sqr52_dead = 0;
	}  
	if ( scope.sqr53_dead == "" ) {
		scope.sqr53_dead = 0;
	}  
	if ( scope.sqr54_dead == "" ) {
		scope.sqr54_dead = 0;
	}  
	if ( scope.sqr55_dead == "" ) {
		scope.sqr55_dead = 0;
	}	
	scope.sqr5_viable_total = parseInt(scope.sqr51_viable)+ parseInt(scope.sqr52_viable) + parseInt(scope.sqr53_viable) + parseInt(scope.sqr54_viable) + parseInt(scope.sqr55_viable); /** Find total viable cells */ 
	scope.sqr5_dead_total = parseInt(scope.sqr51_dead) + parseInt(scope.sqr52_dead) + parseInt(scope.sqr53_dead) + parseInt(scope.sqr54_dead) + parseInt(scope.sqr55_dead); /** Find total dead cells */
	calculateValues(scope.sqr5_viable_total,scope.sqr5_dead_total,5,scope); /** Total cell calculation */
}
/** Find the totals of viable and dead cell for the inputed table values for square 4 */
function findTotals(scope){
	viable_cells_value = 0;
	cells_needed = 0;
	original_volume = 1;	
	if ( scope.sqr41_viable == "" ) { /** Avoid null values in viable table cells */
		scope.sqr41_viable = 0;
	}  
	if ( scope.sqr42_viable == "" ) {
		scope.sqr42_viable = 0;
	}  
	if ( scope.sqr43_viable == "" ) {
		scope.sqr43_viable = 0;
	}  
	if ( scope.sqr44_viable == "" ) {
		scope.sqr44_viable = 0;
	}	
	if ( scope.sqr41_dead == "" ) { /** Avoid null values in viable table cells */
		scope.sqr41_dead = 0;
	}  
	if ( scope.sqr42_dead == "" ) {
		scope.sqr42_dead = 0;
	}  
	if ( scope.sqr43_dead == "" ) {
		scope.sqr43_dead = 0;
	}  
	if ( scope.sqr44_dead == "" ) {
		scope.sqr44_dead = 0;
	}	
	scope.sqr4_viable_total = parseInt(scope.sqr41_viable) + parseInt(scope.sqr42_viable) + parseInt(scope.sqr43_viable) + parseInt(scope.sqr44_viable); /** Find total viable cells */
	scope.sqr4_dead_total = parseInt(scope.sqr41_dead) + parseInt(scope.sqr42_dead) + parseInt(scope.sqr43_dead) + parseInt(scope.sqr44_dead); /** Find total dead cells */
	calculateValues(scope.sqr4_viable_total,scope.sqr4_dead_total,4,scope); /** Total cell calculation */
}
/** Slider event change for getting the cells needed */
function getCellsNeedFN(scope){
	cells_needed = 	scope.needCells;
	if ( scope.needCells == "" || isNaN(scope.needCells) ) {
		scope.cells_needed = 0;
		scope.media_volume = 0+ " μ";
	} else {		
		scope.media_volume = (((Number(cells_needed)/(Number(viable_cells_value))*1000))).toFixed(2)+ " μ";	/** Calculate the media volume for the number of cells needed got from the slider value */
	}	
}
/** Total viable cell per sample input got from input text box */
function showVolumeFN(scope){	
	scope.total_viable_cell_sampl = Number(scope.viable_cells) * scope.sample_volume; /** Calculate the total viable cells per sample */
}
/** Calculation function */
function calculateValues(viableCell,deadCell,no_Cells,scope) {
	original_volume = scope.sample_volume;
	scope.total_cells = viableCell + deadCell; /** Total cells = total viable cells + total dead cells */	
	scope.percent_viability = ((Number(viableCell)/(Number(viableCell)+Number(deadCell)))*100).toFixed(2); /** Percentage viability = viable cell /(viable cell+dead cell)*100 */
	scope.avg_viable_cells = (Number(viableCell)/no_Cells).toFixed(2); /** Average viable cells = viable cells/number of squares */
	scope.viable_cells = (Number(scope.avg_viable_cells)*2*10000).toFixed(2); /** Viable cells = average viable cells * 2 * 10000 */
	viable_cells_value = scope.viable_cells;	
	scope.total_viable_cell_sampl = Number(scope.viable_cells)* scope.sample_volume; /** Total viable cells per sample = viable cells * sample volume */	
	if ( scope.needCells == "" || isNaN(scope.needCells) ) {
		scope.media_volume = 0+ " μ";
	} else {
		scope.media_volume = (((Number(cells_needed)/(Number(viable_cells_value))*1000))).toFixed(2)+ " μ"; /** Calculate the media volume for the number of cells needed got from the slider value, media volume = (cells needed/viable cells) * 1000 */
	}
	if ( isNaN(scope.percent_viability) ) { /** To avoid not a number displaying for percentage viability calculation */
		scope.percent_viability = 0;
	}
}
/** Calculation part ends here **/