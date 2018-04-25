Router
.add('/page1/a/:id', {
    templateUrl: '/client/p1.html'
})
.add('/page2/:param/:param2', {
    templateUrl: '/client/p2.html'
})
.add('/page3/:val/:test', {
    templateUrl: '/client/p3.html'
});

Router.default('/page2');

function checktext() {
    console.log(document.getElementById("editable"));
    document.getElementById("blog").innerHTML =  document.getElementById("editable").innerHTML;
}