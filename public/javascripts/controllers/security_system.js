app
    .factory( 'AuthRepository', [ '$http', '$cookies', '$location', '$rootScope', function( $http, $cookies, $location, $rootScope ) {
        return {
            login : ( username, password ) => $http.post( 'auth/login/', JSON.stringify( { username : username, password : password } ) ),
            logout : () => $http.post( 'auth/logout' ),
            removeSession : () => { $cookies.remove( 'userdata' ) },
            getFullAuthData : () => this.getSession().auth_data,
            getUserCat : () => $http.get( 'auth/usercat/' ),
            isSessionSet : function() {
                var userCookie = $cookies.get('userdata');
                return ( userCookie == undefined ) ? false : true;
            },
            getSession : function() {
                var userCookie = $cookies.get('userdata');
                return ( userCookie == undefined ) ? undefined : JSON.parse(userCookie);
            },
            viewVerification : function() {
                if( !this.isSessionSet() ) {
                    $rootScope.isLoggedIn.show_app = false;
                    $rootScope.isLoggedIn.show_auth = true;
                    $location.path( '/' );
                    return false;
                } else {
                    $rootScope.isLoggedIn.show_app = true;
                    $rootScope.isLoggedIn.show_auth = false;
                    return true;
                }
            },
            setMenu : function() {
                $rootScope.snd_menu_items = {
                    general : [
                        {
                            name : 'Overview',
                            icon : 'fa fa-eye',
                            status : 'active',
                            link : '#/overview'
                        },
                        {
                            name : 'Tareas',
                            icon : 'fa fa-calendar-check-o',
                            status : '',
                            link : '#/tasks_super_admin'
                        },
                        {
                            name : 'Tareas',
                            icon : 'fa fa-calendar-check-o',
                            status : '',
                            link : '#/tasks_admin'
                        },
                        {
                            name : 'Tareas',
                            icon : 'fa fa-calendar-check-o',
                            status : '',
                            link : '#/tasks_general'
                        }
                    ],
                    objects : [
                        {
                            name : 'Cabañas',
                            icon : 'fa fa-bed',
                            status : '',
                            link : '#/cabins'
                        },
                        {
                            name : 'Albercas',
                            icon : 'fa fa-bath',
                            status : '',
                            link : '#/pools'
                        },
                        {
                            name : 'Áreas',
                            icon : 'fa fa-puzzle-piece',
                            status : '',
                            link : '#/areas'
                        }
                    ],
                    sales : [
                        {
                            name : 'Punto de venta',
                            icon : 'fa fa-credit-card',
                            status : '',
                            link : '#/reservations'
                        },
                        {
                            name : 'Ventas',
                            icon : 'fa fa-money',
                            status : '',
                            link : '#/sales'
                        },
                        {
                            name : 'Reportes',
                            icon : 'fa fa-bar-chart',
                            status : '',
                            link : '#/reports'
                        }
                    ],
                    settings : [
                        {
                            name : 'Tipos de Área',
                            icon : 'fa fa-list-alt',
                            status : '',
                            link : '#/areatypes'
                        },
                        {
                            name : 'Tipos de Cabaña',
                            icon : 'fa fa-list-alt',
                            status : '',
                            link : '#/cabintypes'
                        },
                        {
                            name : 'Tipos de Reservación',
                            icon : 'fa fa-list-alt',
                            status : '',
                            link : '#/reservationtypes'
                        },
                        {
                            name : 'Estatus de Pagos',
                            icon : 'fa fa-list-alt',
                            status : '',
                            link : '#/paymentstatus'
                        },
                        {
                            name : 'Contenidos',
                            icon : 'fa fa-align-left',
                            status : '',
                            link : '#/contents'
                        },
                        {
                            name : 'Promociones',
                            icon : 'fa fa-align-left',
                            status : '',
                            link : '#/promotions'
                        },
                        {
                            name : 'Sitio',
                            icon : 'fa fa-globe',
                            status : '',
                            link : 'http://balneariolaspalmas.co/'
                        }
                    ]
                };

                var session_o = this.getSession();

                if( session_o ) {
                    switch (session_o.rol.value) {
                        case 1:
                            $rootScope.snd_menu_items.general.splice( 2, 2 );
                            break;
                        case 2:
                            $rootScope.snd_menu_items.general.splice( 1, 1 );
                            $rootScope.snd_menu_items.general.splice( 2, 1 );
                            $rootScope.snd_menu_items.settings.splice( 0, 4 );
                            break;
                        case 3:
                            $rootScope.snd_menu_items.general.splice( 1, 2 );
                            $rootScope.snd_menu_items.sales.splice( 2, 1 );
                            $rootScope.snd_menu_items.settings.length = 0;
                            $rootScope.snd_menu_items.objects.length = 0;
                            break;
                    }
                }
            },
            setActiveMenu : function( element ) {
                $rootScope.snd_menu_items.general.forEach( e => e.status = '' );
                $rootScope.snd_menu_items.sales.forEach( e => e.status = '' );

                if( $rootScope.snd_menu_items.settings ) {
                    $rootScope.snd_menu_items.settings.forEach( e => e.status = '' );
                }
                if( $rootScope.snd_menu_items.objects ) {
                    $rootScope.snd_menu_items.objects.forEach( e => e.status = '' );
                }

                element.status = 'active';
            }
        }
    }])
    .controller( 'auth-controller', [ '$scope', '$location', '$rootScope', 'AuthRepository', function( $scope, $location, $rootScope, AuthRepository ) {

        $scope.login = function() {
            AuthRepository.login( $scope.username, $scope.password ).success( function( data ) {
                if( data.error ) {
                    $scope.errors = data.message;
                } else {
                    $scope.message = data.message;
                    $rootScope.user_info = AuthRepository.getSession();
                    AuthRepository.setMenu();
                    $location.path( '/overview' );
                }
            }).error( function( error ) {
                $scope.errors = error;
            });
        };
    }]);
