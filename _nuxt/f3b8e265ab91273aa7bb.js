(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{657:function(e,t,r){"use strict";r.r(t);r(328),r(77);var n=r(16),c=r(160),o=r(88),l={middleware:"auth",pageTitle:"Contacts",data:function(){return{users:[],showSearch:!1,activeSearch:!1,search:"",title:"Contacts"}},created:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){var r,n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r={"out.tape.cell":{$elemMatch:{s:o.a.user,i:0}}},t.next=3,c.TreeHugger.findAllNodes({find:r});case 3:n=t.sent,e.users=n.map((function(t){return e.$store.getters.getUser(t)}));case 5:case"end":return t.stop()}}),t)})))()},methods:{searchUsers:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){var r,n;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.showSearch){t.next=4;break}return e.showSearch=!0,document.getElementById("user_search").focus(),t.abrupt("return");case 4:return e.activeSearch=!0,r={"out.tape":{$elemMatch:{cell:{$all:[{$elemMatch:{s:o.a.user,i:0}},{$elemMatch:{s:{$regex:e.search,$options:"i"},i:1}}]}}}},t.next=8,c.TreeHugger.findAllNodes({find:r});case 8:n=t.sent,e.users=n.map((function(t){return e.$store.getters.getUser(t)})),e.activeSearch=!1;case 11:case"end":return t.stop()}}),t)})))()},back:function(){this.showSearch?this.showSearch=!1:$nuxt.$router.push("/")}}},h=r(57),v=r(90),m=r.n(v),d=r(586),w=r(590),f=r(587),x=r(588),S=r(206),_=r(327),k=r(207),V=r(122),$=r(209),T=r(127),y=r(597),C=r(643),I=r(214),component=Object(h.a)(l,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-app",[r("v-app-bar",{attrs:{color:"primary",app:"","elevate-on-scroll":""}},[r("v-btn",{attrs:{icon:""},on:{click:e.back}},[r("v-icon",[e._v("mdi-arrow-left")])],1),e._v(" "),r("v-toolbar-title",{directives:[{name:"show",rawName:"v-show",value:!e.showSearch,expression:"!showSearch"}]},[e._v("Contacts")]),e._v(" "),r("v-text-field",{directives:[{name:"show",rawName:"v-show",value:e.showSearch,expression:"showSearch"}],attrs:{"hide-details":"",id:"user_search",placeholder:"Type keyword..."},on:{keyup:e.searchUsers},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),e._v(" "),r("div",{staticClass:"flex-grow-1"}),e._v(" "),r("v-btn",{attrs:{icon:""},on:{click:e.searchUsers}},[r("v-icon",[e._v("mdi-magnify")])],1),e._v(" "),r("v-progress-linear",{attrs:{active:e.activeSearch,indeterminate:e.activeSearch,absolute:"",bottom:"",color:"deep-purple accent-4"}})],1),e._v(" "),r("v-content",[r("v-list",{directives:[{name:"show",rawName:"v-show",value:!e.activeSearch,expression:"!activeSearch"}]},e._l(e.users,(function(t){return r("v-list-item",{key:t.address,on:{click:function(r){return e.$nuxt.$router.push("/chat/"+t.address)}}},[r("v-list-item-avatar",[r("v-img")],1),e._v(" "),r("v-list-item-content",[r("v-list-item-title",{domProps:{textContent:e._s(t.name)}})],1)],1)})),1)],1)],1)}),[],!1,null,null,null);t.default=component.exports;m()(component,{VApp:d.a,VAppBar:w.a,VBtn:f.a,VContent:x.a,VIcon:S.a,VImg:_.a,VList:k.a,VListItem:V.a,VListItemAvatar:$.a,VListItemContent:T.a,VListItemTitle:T.b,VProgressLinear:y.a,VTextField:C.a,VToolbarTitle:I.a})}}]);