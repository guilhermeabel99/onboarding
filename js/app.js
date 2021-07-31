/*! my_project - 0.0.1 - 2014-10-06 */
var MailModule = angular.module("MailModule", ['ui.mask', 'angularFileUpload']);
MailModule.config(["$locationProvider", function($locationProvider) {

}]), MailModule.run(function() {}), MailModule.controller("MainCtrl", [
    "$scope", "$http", "$location", "$httpParamSerializer", "$window", "$timeout", '$upload',
    function($scope, $http, $location, $httpParamSerializer, $window, $timeout, $upload) {
        
        $scope.init = {};
        $scope.autofill = function(){
            angular.forEach($location.search(), function(value, key){
                $scope.init[key] = value;
                var el = document.querySelector('[name=' + key.toLowerCase() + ']');
                if(el){
                    $timeout(function(){
                        el.value = $scope.init[key];
                        angular.element(el).triggerHandler('input');
                    });
                }

            });
        };

        $scope.autofill();

        $scope.onFileSelect = function ($files) {
            $scope.progress = [];
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            $scope.dataUrls = [];
        };

        $scope.close = function () {
            $window.close();
        };

        $scope.errorMessage = null;
        $scope.successMessage = null;
        $scope.isRequired = true;

        /**
         * Envia email
         */
        $scope.send = function() {

            $scope.init.Assunto = $scope.init.assunto;
            if ($scope.init.nome == 'testeTh') {
                $scope.init['Cliente'] = 'TesteTh'
            }else{
            switch($scope.init.assunto){
                case 'Dúvidas sobre o faturamento':
                    $scope.init['Cliente'] = "HiFinanceiro";
                    break;
                case '2ª via de boleto/nota fiscal':
                    $scope.init['Cliente'] = "HiFinanceiro";
                    break;
                case 'Renegociação de pagamentos':
                    $scope.init['Cliente'] = "HiCobranca";
                    break;
                case 'Dúvidas sobre contratos':
                    $scope.init['Cliente'] = "HiContrato";
                    break;
            }
        }

            $scope.submitted = true;
            $scope.DISABLE_FIELDS = true;

                if ($scope.selectedFiles) {
                    $scope.upload = $upload.upload({
                        url: "/api/ContactForm/SendEmailAttach",
                        method: "POST",
                        data: $scope.init,
                        file: $scope.selectedFiles || "",
                        fileFormDataName: 'file'
                    }).success(function (data) {
                        $scope.successMessage = "E-mail enviado com sucesso."
                        $scope.init = {};
                        $scope.form.$setPristine();
                        $scope.submitted = false;
                    }).error(
                        function (data) {
                            $scope.errorMessage = "Ocorreu um erro ao enviar o e-mail. Tente novamente.";
                        }
                    );;

                    $scope.upload.then(function (response) {
                        $timeout(function () {
                            $scope.uploadResult.push(response.data);
                            console.log($scope.uploadResult);
                        });
                    });
                } else {
                    var requestObj = {
                        method: "POST",
                        url: "/api/ContactForm/SendEmail",
                        data: $scope.init,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                }

                // chama requisição http
                $http(requestObj).success(
                    function (data) {
                        $scope.init.nome = "";
                        $scope.init.email = "";
                        $scope.init.motivo = "";
                        $scope.successMessage = "E-mail enviado com sucesso.";
                        $timeout( function()
                        {
                            $scope.DISABLE_FIELDS = false;

                        }, 1000);
                    }
                ).error (
                    function (data) {
                        $scope.errorMessage = "Ocorreu um erro ao enviar o e-mail. Tente novamente.";
                        $timeout( function()
                        {
                            $scope.DISABLE_FIELDS = false;
                        }, 1000);
                    }
                );
            
            $timeout( function()
            {
                $scope.DISABLE_FIELDS = false;
            }, 1000);
        };
}]);

