(function(){
    angular
    .module('users',['FBAngular'])
    .controller('userController', [
        '$mdSidenav', '$mdBottomSheet', '$log', '$q','$scope','$element','Fullscreen','$mdToast','$animate',
        userController
    ]);
	   
    /**
    * Main Controller for the Angular Material Starter App
    * @param $scope
    * @param $mdSidenav
    * @param avatarsService
    * @constructor
    */
    function userController( $mdSidenav, $mdBottomSheet, $log, $q,$scope,$element,Fullscreen,$mdToast, $animate) {
	    $scope.toastPosition = {
            bottom: true,
            top: false,
            left: true,
            right: false
        };
		/** Menu swipe */
        $scope.toggleSidenav = function(ev) {
            $mdSidenav('right').toggle();
        };
		/** Enable radio button square 4 as selected initially */
		$scope.d15 = {
		tables : 'squareCnt4'
		}
        $scope.getToastPosition = function() {
            return Object.keys($scope.toastPosition)
            .filter(function(pos) { return $scope.toastPosition[pos]; })
            .join(' ');
        };
        $scope.showActionToast = function() {        
            var toast = $mdToast.simple() /** Instruction 1 */
            .content(helpArray[0])
            .action(helpArray[3])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
        
            var toast1 = $mdToast.simple() /** Instruction 2 */
            .content(helpArray[1])
            .action(helpArray[3])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
		  
            var toast2 = $mdToast.simple() /** Instruction 3 */
            .content(helpArray[2])
            .action(helpArray[4])
            .hideDelay(15000)
            .highlightAction(false)
            .position($scope.getToastPosition());
            
            $mdToast.show(toast).then(function() { /** Instruction 1 */
                $mdToast.show(toast1).then(function() { /** Instruction 2 */
                    $mdToast.show(toast2).then(function() { /** Instruction 3 */
			  		});
			  	});
            });		
        };
		/** Initializing variables */
        var self = this;
        self.selected     = null;
        self.users        = [ ];
        self.toggleList   = toggleUsersList;
        $scope.showValue = false; /** It hides the 'Result' tab */
        $scope.showVariables = false; /** I hides the 'Variables' tab */
        $scope.isActive = false;        
		$scope.square4 = true; /** show table square count 4 */
		$scope.square5 = false; /** Hide table square count 5 */
		$scope.sample_volume = 1; /** Initialize the slider to 1 */
		
		/** change orginal sample volume slider */
		$scope.orginalVolSample = function () {
        	$scope.sample_vol=$scope.sample_volume;
			showVolumeFN($scope); 
        };
		/** change radio button event for showing tables */
		$scope.showTables = function () {
        	if ($scope.d15.tables == "squareCnt5") { /** If selected radio value is table with suare count 5 */
        		$scope.square4 = false;
        		$scope.square5 = true;
				resetTable5();
    		} else { /** If selected radio value is table with suare count 4 */
        		$scope.square5 = false;
        		$scope.square4 = true;
				resetTable4();
   		 	}
        };
		/** Button click for changing monitor and binocular views */
		$scope.changeViews = function () {
        	changeView($scope);
        };
		/** Changing lense on drop down event change */
		$scope.changeLense =function(){
            changeLenseFn($scope);
        };
		/** Event change for table with square count 4 modification */
		$scope.test = function () {
			findTotals($scope);
        };
		/** Event change for table with square count 5 modification */
		$scope.square5Calc = function () {
			findTotalssqr5($scope);
        };
		/** Event change for orginal volume of sample slider */
		$scope.getCellsNeed = function () {
			getCellsNeedFN($scope);
        };
		//////////////////////////////
        $scope.goFullscreen = function () {
            /** Full screen */
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
            /** Set Full screen to a specific element (bad practice) */
            /** Full screen.enable( document.getElementById('img') ) */
        };
        $scope.toggle = function () {
            $scope.showValue=!$scope.showValue;
            $scope.isActive = !$scope.isActive;
        };        
        /**
        * First hide the bottom sheet IF visible, then
        * hide or Show the 'left' sideNav area
        */
        function toggleUsersList() {
            $mdSidenav('right').toggle();
        }		
		/** Reset all square 5 table values */
		function resetTable5(){
			$scope.sqr51_viable = $scope.sqr51_dead = $scope.sqr52_viable = $scope.sqr52_dead = $scope.sqr53_viable = 
			$scope.sqr53_dead = $scope.sqr54_viable = $scope.sqr54_dead = $scope.sqr55_viable = $scope.sqr55_dead = 
			$scope.sqr5_viable_total = $scope.sqr5_dead_total = $scope.percent_viability = $scope.total_cells = 
			$scope.avg_viable_cells = $scope.viable_cells = $scope.total_viable_cell_sampl = $scope.needCells = $scope.media_volume = 0;
			$scope.sample_volume = $scope.sample_vol = 1;
		}
		/** Reset all square 4 table values */
		function resetTable4(){
			$scope.sqr41_viable = $scope.sqr41_dead = $scope.sqr42_viable = $scope.sqr42_dead = $scope.sqr43_viable = 
			$scope.sqr43_dead = $scope.sqr44_viable = $scope.sqr44_dead = $scope.sqr4_viable_total = $scope.sqr4_dead_total = 
			$scope.percent_viability = $scope.total_cells = $scope.avg_viable_cells = $scope.viable_cells = 
			$scope.total_viable_cell_sampl = $scope.needCells = $scope.media_volume = 0;
			$scope.sample_vol =$scope.sample_volume = 1;			
		}
    }
})();