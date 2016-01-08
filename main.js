var app = angular.module('partyVote', ['rzModule', 'ui.bootstrap']);

app.controller('MainCtrl', function ($scope) {
  var totalSeats = 34;
  var parties = [
    {id: 'remain', name: '未分配比例'},
    {id: 'dpp', name: '民主進步黨'},
    {id: 'kmt', name: '中國國民黨'},
    {id: 'npp', name: '時代力量'},
    {id: 'sdp', name: '綠黨與社民黨聯盟'},
    {id: 'pfp', name: '親民黨'}
  ];
  $scope.parties = {};
  
  
  function onChange() {
    var id = this.id;
    var party = $scope.parties[id];
    var total = 0.00;
    var advancedTotal = 0.00;
    parties.forEach(function(party) {
      if (party.id !== 'remain') {
        total += party.value;
      }
    });
    $scope.parties.remain.value = 100 - total;
    
    if ($scope.parties.remain.value < 0) {
      party.value = parseFloat(party.value) + parseFloat($scope.parties.remain.value);
      $scope.parties.remain.value = 0;
    }
    
    parties.forEach(function(party) {
      party.win = parseFloat(party.value) >= 5;
      if (party.win) {
        advancedTotal += parseFloat(party.value);
      }
    });
    
    var givenSeats = 0;
    parties.forEach(function(party) {
      if (party.win) {
        party.advancedValue = Math.floor((parseFloat(party.value) * (100 / advancedTotal))*100)/100;
        party.seats = Math.floor(totalSeats * (party.advancedValue / 100));
        givenSeats += party.seats;
      }
      else {
        party.advancedValue = 0;
        party.seats = 0;
      }
    });
    
    if (givenSeats < totalSeats) {
      parties.sort(function (a, b) {
        return b.seats - a.seats;
      });
      for (i = 0 ; givenSeats < totalSeats ; i++, givenSeats++) {
        parties[i].seats += 1;
      }
    }
  }
  
  parties.forEach(function(party) {
    $scope.parties[party.id] = party;
    party.value = party.id === 'remain' ? 100 : 0;
    party.seats = party.id === 'remain' ? totalSeats : 0;
    party.advancedValue = party.id === 'remain' ? 100 : 0;
    party.options = {
      id: party.id,
      ceil: 100,
      precision: 2,
      step: 0.01,
      vertical: true,
      readOnly: party.id === 'remain',
      onChange: onChange,
      onEnd: onChange
    };
  });
});
