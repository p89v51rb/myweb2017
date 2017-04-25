/**
 * Created by Event on 3/28/17.
 */
angular.module('myApp',[])
    .controller('timelineController',['$scope',function($scope){
        $scope.hello = "hello, world.";
        var margin = {top: 40, right: 20, bottom: 30, left: 40};
        var width = 960 - margin.left - margin.right;
        var height = 650 - margin.top - margin.bottom;
        var color = d3.scale.ordinal().range(["#57AB57", "#BCDDBC", "#ff8c00", "#FFE1E1", "#FFADAD", "#FF7979", "#6b486b"]);

        var formatPercent = d3.format(".0%");

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
        var x2 = d3.scale.ordinal()
            .rangeBands([0, width], 0);

        // var y = d3.scale.linear()
        //     .range([height, 0]);

        var y = d3.time.scale()
            .range([height, 0]);

        var y2 = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.time.format("%H:%M"))
            .ticks(24);
            // .tickFormat(formatPercent);

        // var line = d3.svg.line()
        //     .y(function(d) { return y(8); });


        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return "<strong>Sleeptime:</strong> <span style='color:grey'>" + d.gobedorigin + "-" + d.getUporigin + "</span>";
            })

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var parseDate = d3.time.format("%H:%M").parse;

        svg.call(tip);

        var timeflag = parseDate("12:00");

        d3.tsv("data/17-04.tsv", function(error, data) {
            data.forEach(function(d) {
                d.gobedorigin = d.goBed;
                d.getUporigin = d.getUp;
                d.goBed = parseDate(d.goBed);
                d.letter = d.letter;
                d.getUp = parseDate(d.getUp);
            });

            // var hourTime = ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00"];

            x.domain(data.map(function(d) { return d.letter; }));
            x2.domain(data.map(function(d) { return d.letter; }));

            y.domain(d3.extent(data, function(d) {
                return d.goBed; }));

            y2.domain([0, 24]);
            var line1 = d3.svg.line()
                .x(function(d, i) {
                    return x2(d.letter); })
                .y(function(d, i) {
                    return y2(11);
                });
            var line2 = d3.svg.line()
                .x(function(d, i) {
                    return x2(d.letter); })
                .y(function(d, i) {
                    return y2(18);
                });

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line1);
                // y.domain([0, d3.max(data, function(d) {
                //     console.log(d.goBed);
                //     return d.goBed;
                // })]);

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .attr("d", line2);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height/1.5 + ")")
                    .call(xAxis);

            //dy是y轴名称的位置；
            
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y",6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Sleep Time");

            svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.letter); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) {
                        // return y(d.goBed);

                        return (y(d.getUp) - y(timeflag));
                    })
                    .attr("height", function(d) {
                        if(y(d.goBed) > y(timeflag)){
                            return (y(d.goBed) - y(d.getUp));
                        } else {
                            if ((y(d.goBed) - y(d.getUp) + 2 * y(timeflag)) > 0) {
                                return (y(d.goBed) - y(d.getUp) + 2 * y(timeflag));
                            } else {
                                console.log(d.getUp);
                                return (y(d.getUp) - y(d.goBed) - 2 * y(timeflag));
                            }
                        }
                    })
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide);

            svg.selectAll(".bar")
                .each(function(d,i){
                    d3.select(this).attr("style", "fill: " + color(i));
                });


            var value = ["周一","周二","周三","周四","周五","周六","周日"];

            var legendColor =["#57AB57", "#BCDDBC", "#ff8c00", "#FFE1E1", "#FFADAD", "#FF7979", "#6b486b"];
            var legend = svg.selectAll(".legend")
                .data(legendColor)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) {
                    return "translate("+(i * 30+20)+",0)";
                });
            legend.append("rect")
                .attr("width", 30)
                .attr("height", 20)
                .style("fill", function (d) {
                    return d;
                });
            legend.append("text")
                .attr("x", 0)
                .attr("y", 30)
                .attr("dy", ".35em")
                .data(value)
                .text(function (d) {
                    return d;
                });

        });

        function type(d) {
            d.goBed = +d.goBed;
            return d;
        }

    }])
    .controller('pieController',['$scope',function($scope){
        $scope.pielovers =
        [{
            "title":"",
            "info":"理工男一枚，过了而立之年两岁。身高180，略胖，有点壮。国内985本，海外博士毕业后，拿到绿卡，工作了几年。父母不能提供帮助，也不会带来负担。有过一次婚姻，有女儿归前妻，现已单身2年（不是我的问题）.码农，赶上互联网浪潮，决心回国，一线的1.3m/y和二线的0.8m/y,最终选择后者，为了图个安逸。有房，也有代步车。若有缘，可以换工作到一线，不认为有太大困难。 性格属于外向，爱旅游，去了几十个国家了。希望MM\：83年之前，身高160+，本科以上学历，性格温柔，不要太胖，是否离异不限，其它靠眼缘吧。",
            "contact":" 2213305988@qq.com",
            "other":"来信者请介绍一下自己的个人、工作和家庭情况，附照片必回复",
            "sex":"male"
        },
            {
                "title":"",
                "info":"首先声明不是本人征，不要发站内。 这哥们是我同学的同事，认识三年了，成为很好的朋友，感觉很实在的一人，没有花花心眼，为人比较厚道可靠，一直还没有成家，以前曾给介绍过，但是没成，最近一起吃饭聊起这事，作为朋友还是希望再帮一把，在这儿给他试试。 朋友的基本情况：36岁，身高大约170，体重120左右，北方人，985硕士，工作在国有单位，处级中层，京户，有房车。性格比较温和，做事稳重踏实，绝对的暖男，与人在一起做事时总是想别人多一些。平时喜欢看球、打台球，我们经常一起打，做的一手好饭。他父母在老家。感情方面，这哥们有点执着，属于不合适不交往的那种，比较单一，这可能也是我们介绍后没成的原因吧。 根据他以前说的条框，希望找的女生：年龄32及以下，身高158以上，本科以上。性格善良随和，孝顺父母，感情简单，洁身自好。偏好医生教师或财经类职业，有京户，喜欢山东姑娘，京津冀一带的也可以。当然这哥们也说，没准合适了，什么条件都不存在。 希望有意者给他直接写信吧，不要发给我，请将个人情况和照片发到他邮箱lukinger11@126.com，根据对他的了解，不管如何，他肯定会回复邮件。",
                "contact":"lukinger11@126.com",
                "other":"马上40,一米七，还这么挑...",
                "sex":"male"
            },
            {
                "title":"",
                "info":"男生/来自北方二线城市家庭/175/1979年/长相帅气，儒雅白净，长得年轻/京户，现居北京城内。 北京重点理工类专业本硕毕业，在学校各方面一直都较为优秀，也比较上进，现在一家大型国企工作，经济条件良好。 家庭环境和睦民主，父亲退休，母亲即将退休。 性格开朗温和，心智成熟，脾气好，健谈幽默，和他在一起比较开心，不沉闷，做人做事踏实稳重，为人正直，也谦逊低调，生活观念传统，生活习惯良好，作息规律。 业余时间爱好音乐、羽毛球、阅读、爬山、电影等，如果两个人相亲相爱，一起做任何事都会有趣味。 他是个责任感较强的人，一直交友慎重，感情方面也较为谨慎，谈过，但不算多，和前任分隔两地较长时间，后来分手，年龄就不小了。也单身多年了，一直希望找到一个相濡以沫的靠谱女生。记得有人说过：“有些男人选女孩，要贤惠，要知书达理，要温柔，可最后见了美女就走不动道了。其实，人在面对新鲜的东西时，往往会被它的外表迷住，可一旦熟悉了，再好看也不会珍惜。所以，好看，只能满足一时；靠谱，才能可靠一辈子。” 和所有男生一样，本篇男主人公也并不完美，也有自身的不足，但确有不少适合做丈夫的可贵的品行和素质，也希望你的到来能促进互相的进步，真爱是心心相印。希望在这个夏天遇见你，和你走过未来的冬夏春秋…… 对mm的期许其实也很简单：长相顺眼，净高160+，善良体贴、开朗坦诚，不作不闹，能居家过日子，能洁身自爱。年龄82年及之后，有一份自己喜欢的稳定工作就好。 有意有缘mm请直接发信到邮箱，祝福你们！ sirinet@yeah.net 附照更好，也祝各位早日找到人生伴侣，谢谢。",
                "contact":"sirinet@yeah.net",
                "other":"",
                "sex":"male"
            },
            {
                "title":"",
                "info":"表弟85年，身高175，北京人，重点大学本硕，500强企业技术工作，收入尚可。 代步车一辆，房子一套（有少量贷款）。 不抽烟，不酗酒，爱生活，爱旅行，爱美食。 对女孩的要求，希望是86后，本科以上，爱运动，爱旅行加分！ 非本人，有意请发邮件pie2017@163.com，最好有照片，必回。",
                "contact":"pie2017@163.com",
                "other":"",
                "sex":"male"
            },
            {
                "info":"基本信息： 83年，南方人 170cm 身材保持不错，面貌尚可，打扮下也有说帅的。 05年毕业于某部署211院校（985在职硕士在读），毕业后来北京工作。北京户口 通州有房（有贷） 有一弟弟，老家公务员，父母身体健康 目前500强著名it外企工作，以前做过多年的team lead，目前主要从事技术 不怎么加班正在摇号中 性格爱好： 体贴温柔，感情细腻，喜欢一个人会很用心，会陪看电影，逛街，一起做饭一起看电视 爱好广泛，喜欢各种球类运动 喜欢健身游泳 喜欢拍照。平时也爱好吉他，应该是理工科里面有那么一点点文艺的男生。 生活习惯良好，不抽烟酗酒 平时业余也会注重学习，补充知识，提高各方面素质 对未来的设想：希望找到喜欢的女生，由喜欢到深爱，组在北京成立自己的温馨小家庭。两个人相互携手，一起奔向美好的未来。也相信自己会一辈子宠爱自己的女人。 同事也希望女生能够热爱生活，活泼开朗些为好。会打扮自己，有点自己的兴趣爱好。",
                "contact":"qq5098@sohu.com",
                "other":"希望你通情达理，上得厅堂下得厨房，性情开朗，普通话OK。 ",
                "sex":"male"
            },
            {
                "title":"",
                "info":"173/65，北京人，有房无车。211本，互联网工作，收入稳定。 喜爱运动，旅游，音乐。 希望女孩，性格阳光，不太矮太胖，有自己的事业和爱好，其他随缘。",
                "contact":"815396539",
                "other":"",
                "sex":"male"
            },
            {
                "tilte":"替88年有为男青年真诚征友",
                "info":"88年摩羯一只,身高176,体重65kg,河北邯郸人,本科学历. 目前在一家互联网公司从事产品经理工作. 车房已买,但均为贷款. 个人比较喜欢看经典电影 电视剧,偶尔看看动漫, 喜欢看书和练字. 对她的期待:略有严控,喜欢懂事知礼的女孩子,年龄88后，偏喜欢165+高挑女孩,但非硬性标准,主要看眼缘和性格;学历方面,本科以上学历吧,也非硬性,主要看是否有共同语言即可,毕竟,喜欢就好,其他条件都是次要的. ",
                "contact":"81881224(微信)",
                "other":"",
                "sex":"male"
            },
            {
                "title":"86GG诚征女友 ",
                "info":"介绍下自己：86年，山东人，理工硕，央企技术工作。身高174，体重70，长相见照片。京户，北三环小房。三观正确，正直善良，也算个有趣的人。喜欢运动，另外对历史文学摄影电影美剧都感兴趣，热爱生活，对世界抱有好奇心。 对另一半的期待：人品好，有趣，有眼缘，86年以后，北方人加分，文艺女加分，爱运动加分。心机女免入。 来信请寄445076797@qq.com。手机上没装q，最好不要直接加，祝福大家。 ",
                "contact":"445076797@qq.com",
                "other":"",
                "sex":"male"
            },
            {
                "title":"金融IT科技男诚征女友（硕士已购房购车)",
                "info":"GG基本情况： 31，175CM，名校硕士学历，外貌中上，比较有安全感。在顶级技术外企及互联网行业工作多年，目前从事金融科技研发管理工作。 收入待遇还算可以，不怎么乱花钱，在北京和河北都已购房（有贷款），已购京牌占号车一辆，为未来的生活做了一些积累。 书香门第，从小不小心读了很多书籍，知识域比较广阔，从文史哲到前沿科技，老家在某国家中心城市，城市家庭，独生子。 性格随和容易相处，踏实善良，不吸烟不酗酒，胸怀大志，但也是经济适用男，学什么都很快，包括各项生活技能，做饭也很好吃，善于生活。 业余生活也比较丰富，喜欢看电影，爬山，看海，旅游，摄影，美食，还有各种有趣的活动。 见识上还可以，知道自己的方向，比较自信。我已做好结婚准备，闪婚亦可接受，值得拥有和你一生一世的爱情。 \n期望MM： 国籍不限，性别女，1985年后出生，健康，善良，漂亮，阳光，温柔，对女方学历，家庭，收入无硬性要求，主要看缘分. ",
                "contact":"justforyou99999@163.com",
                "other":"你好，看完了你的征婚信息，有点儿小幽默，不错。我表妹单身，86年，京户，165cm，海龟硕士。目前在某大型国企从事人力资源工作。不知道是否符合你的理想？你要是愿意进一步了解的话，我帮你们牵牵线。",
                "sex":"male"
            },
            {
                "title":"可以肩并肩，何必不相见【89男征婚】",
                "info":"征友界的小清新，只为寻找那份命中注定的单纯之爱。 关于我： 我身高1.83，身材适中，五官端正。 理工科研究生毕业，公务员，稳重善良，不喜欢花天酒地，不喜欢疯疯癫癫，比较顾家。 北方城市人，家庭和睦，虽不大富大贵，但也衣食住无忧。京户。爱好还很广泛，写写画画都有，喜欢尝试，来者不拒那。文艺潜质待你开发。 还有我是段子手，跟我在一起应该会很有趣。 我应该属于对女朋友照顾得很细心，脾气很好的类型。暖，但不是中央空调。感情专一。 同事都说我眼光高，实际我觉得只是没有遇到自己的那款。 \n关于梦中的你： 90-93年，身高160+，身材匀称，白净漂亮。 单纯善良，温柔贤惠，善解人意，大方自信。偏爱傻白甜，不喜心机女。 你应该简简单单，有品位懂生活。感情经历简单，感情专一。 重点大学毕业或研究生在读。工作的希望有户口。 终有一天，你我的幸福会被人羡慕，我希望就是从现在开始。",
                "contact":"ylyh2017@163.com",
                "other":"",
                "sex":"male"
            },
            {
                "title":"86硕士gg征mm",
                "info":"86年出生，独生子，身高181cm，硕士，户口在北京，父母亲均已退休，在二老帮助下在京购得一小房，基本无贷款。为人踏实，稳重，心地善良，对工作有进取心，对家庭有责任心。 \n对另一半的期望：86以后出生，身高163cm以上，本科或本科以上学历，在京有稳定工作，长相合眼缘（彼此可交换照片），为人正直，待人真诚，生活上简单，性格随和，善良。",
                "contact":"3149943483",
                "other":"",
                "sex":""
            },
            {
                "title":"清华博士帝都青椒85GG for 生命中的Miss Right",
                "info":"Hello，当你打开看到这个帖子，说明缘份已经在网络世界里为你我搭起了桥梁，很期待能够认识生活中的你。下面是我的简单介绍： 皮囊参数：1985年典型北方汉子、身高177cm、体重160、身体健康、相貌端正 性格：品行端正、正直善良。为己自强自立，为人坦荡真诚。内外兼有偏内、喜欢安静独处思考。 爱好：读书（历史、小说、散文）、亲近自然、健身、音乐观影 工作现状： 帝都某211讲师青年教师。主要从事科研和教学工作，经济收入亦来自这两部分。事业处于上升期，发展相对良好，主持若干项目、发表若干高水平论文、有自己的研究团队。 教育背景：2004-2008帝都某985/211本科、2008-2015清华大学硕士和博士。 家庭背景：北方农村家庭，家庭和睦，家人相亲相爱。父母在老家，哥哥弟弟在家乡省会城市，均已成家立业买房生子。 感情经历：经历简单。与异性能够正常交往，却不善于建立紧密联系，朋友圈狭窄，大概这也是为何单身至今吧。工作至今正在努力改变自己，加强交际沟通能力，希望另一半在这方面多多包容。 经济情况：无房无车，家里无法给予太多支持，主要靠自己打拼。生活上有能力让妻儿衣食无忧（虽然听起来不值一提，但确实是自己努力十几年才得以承诺的未来）。房子方面，开始几年可能需要与我租房住。学校有相关购房优惠政策，但是时间不确定。 对另一半的期许： 身体健康、品行端正、为人真诚宽容、贤惠大方、不物质不势利不俗气。生活中能够与我对上奉养彼此双亲，对下抚育孩子，能够和双方兄弟姐妹相互扶持、相亲相爱。工作上，上进自立，能够支持我的科研工作。学历最好硕士及以上吧，年龄和我相仿或小几岁。其他没有任何要求，一切随缘吧。",
                "contact":"shuimupie85@163.com",
                "other":"多去读读财上海的微博，就不会把自己放那么高了。",
                "sex":"male"
            },
            {
                "title":"比较优秀的GG征mm ",
                "info":"GG基本情况：80年生，170cm，64kg，相貌端正，非高富帅。 GG学历及工作：TOP10理工本+TOP2经管硕士，曾在外企和国企工作过，后创业（千万元级别），发展前景良好，工作较为自由、自主。 GG性格爱好：随和，容易相处，细心体贴，懂得照顾人。生活方式较为简单，平时喜欢运动，不抽烟，也没有其它不好生活习惯（逛夜店、KTV之类）。 希望mm： 84-90年出生，160—170cm,名校本科以上学历(如果硕博或海龟希望本科为名校），身体健康，讲卫生（不在寝室养动物或吃路边小摊）。不要宅或懒，勤奋、爱运动。 另外希望mm聪明好学，对新知识新事物感兴趣，以后可以在事业上、爱好上互相促进，共同发展，或者至少可以有较多的共同语言，平时有话题交流。 暂时就想到这些了，其它的可以相处着看看。 ",
                "contact":"yeffyhy@yeah.net",
                "other":"",
                "sex":""
            },
            {
                "title":"83年gg征婚",
                "info":"山东人，06年来京读研，毕业后留京，目前在一国企工作。一把年纪了还没解决个人问题，来此努力一把，希望能碰到有缘人。 83年摩羯，属狗，身高172，体型还算正常，工科硕士毕业，京户，东五环有房有贷，没有摇到号也没有车，目前国贸附近工作。骨子里的性格较内敛，专一，算是典型的摩羯男，喜好羽毛球、摄影等。 \n寻一善良知性的居家型姑娘为妻，希望一年内能结婚，至于年龄段，86-90吧，属相上86、87、90为宜，身高160-170，本科或以上学历，其余随缘。 希望真诚寻伴的姑娘如果觉得合适可联系我，微信cui_frank，先做个自我介绍。 ",
                "contact":"微信cui_frank",
                "other":"",
                "sex":""
            },
            {
                "title":"代事业单位gg真诚征婚",
                "info":"84年出生 身高181 体重79公斤 211高校硕士毕业,事业单位工作,同时是个小公司合伙人(互联网金融),正在起步阶段 有两房 只有一个房子有贷款 希望女生83年后生人 在京有正式工作 大专以上 身心健康 心地善良 孝顺父母 这些也是随便写写 不是一定要达到 如果感觉好 别的都是浮云 有兴趣先网聊,也可发邮箱简单介绍一下,欢迎发全身无墨镜生活照。3227884374@QQ.com ",
                "contact":"3227884374@QQ.com",
                "other":"",
                "sex":""
            },
            {
                "title":"86gg征婚-清华博后",
                "info":"感谢版主赠予的积分，才终可在pie版发文。 又过一年，回家被催的自己都不好意思了，但愿今年能有点儿说法了。 基本情况：山东泰安人，实际是86年9月，处女座；身高173，体重~65Kg；感情经历简单，外貌普通。 性格：性格肯定不属外向，一直以来亦是稳稳当当。做事认真，对待感情也是如此。 家庭：家庭温馨和睦，母亲是小学教师，刚退休；父亲在企业；有个双胞胎哥哥已定居成都。 学历+工作：05进入清华，09~12三年硕士，12.8~2015.1普博（工科某小专业）。目前继续留在原位置做博士后，收入还可以。目前的生活和做学生时好像没太大区别。未来试图留在学校继续研究工作。 兴趣爱好：没被培养或开发出特别擅长的事情，喜欢看书等静态活动，不是喜欢热闹的秉性。是某英格兰俱乐部的死忠。 \n【要求】：期望姑娘年龄84~90左右吧；学历硕士及以上；性格开朗些（gg自身有时比较闷。。。）、可以比较独立些；家境相当或成长背景相似；最好在海淀附近，两人能离得近些。 有意的姑娘请联系740661986@qq.com，介绍自己的情况，有照必复",
                "contact":"740661986@qq.com",
                "image":"86ggQinghua",
                "other":"",
                "sex":""
            },
            {
                "title":"87年IT男真诚寻找另一半",
                "info":"为自己发帖，在水木寻找合适的另一半，自我介绍下： 87年的IT男，非互联网公司，工作大部分时间可以朝九晚五。北京人，外表对得起观众。目前在海淀工作，有一套小房子，一辆小排量汽车，平时大部分时间喜欢跑步、打打篮球、钓钓鱼、搓两圈国粹，一年基本有2-3次出去旅行的计划。身高：180,体重77.5。目前收入比上不足比下有余，基本还算小康水平。 \n希望另一半： 1、能聊到一起、玩到一起。 2、身高163以上，容貌姣好。 3、本科以上学历，年龄相仿。 4、孝顺父母，对未来生活有所规划。 ",
                "contact":"63756221@qq.com",
                "image":"87ggIT",
                "other":"",
                "sex":""
            },
            {
                "title":"帮一个海归金融同事征友，合适的单身mm不要错过哦",
                "info":"觉得一个同事条件挺不错，所以就帮他征一下。 他是美国海归，金融硕士。回国从事证券投资业务 公司已经帮办了京户。 在工作中感觉他认真谦逊，善于和同事沟通。 目前应该属于高薪收入，现在港通开了之后，做二级市场投资的利润空间也越来越大。 他在美国读书和工作呆了好几年，已经办了绿卡，所以在北京或者美国生活都可以。 他之前主要是在纽约，因为金融行业基本都是在大纽约地区。 他自我介绍如下： 89年，属于90前80后，身高172。在美国养成了爱运动的习惯。喜欢旅游，电影，美食，美剧，脱口秀。 爱好读书（因为工作关系，主要是金融类），擅长股票投资（消费行业和互联网板块） 生长在江浙的公务员家庭，独生子，国外的学习工作经历使得我比较独立，会用更开放的心态待人接物。 所以重事业，直率，阳光，负责，待人诚恳。 \n 初步要求很简单：希望mm善良，真诚，大方，性格活泼开朗。剩下就是看相处的如何。 可联系newyorker19890510@163.com，来信基本都会回复 ",
                "contact":"newyorker19890510@163.com",
                "other":"",
                "sex":""
            },
            {
                "title":"84gg for mm",
                "info":"1 84年,178cm,83kg \n 2 名校硕士,码农,曾经是学霸 \n3 京户,无房无车,现金100多w，现在年薪税前40多w,手里有部分期权。 \n4 10年结婚,11年春天,准备要小孩,去医院检查，无精症.然后11秋离婚. \n5 此后3年多,天天往医院跑.基本上跑遍了北京的医院. 6 宅了2年 7 自己一直独立生活,洗衣做饭,做的不错,可以说精通. \n8 如果您不想在北京,可以跟您一起到别的城市,由您决定. \n9 老家农村的,兄弟姐妹多.还比较相处。 \n10 本想这样过下去算了，但是想想，我们是被上天遗弃的，但是我自己不要遗弃自己。 \n11 我自知条件不太好,如果有不合适的地方,还希望体量. \n期望对方： \n1 不要小孩，两个人一起过日子，性格要合适一些。我觉得这个很重要。 \n2 有一份正经的工作。 \n3 年纪相仿，1990～1982 \n4 其余随缘吧。 \n5 照片私下交换。 \n6 来信：wangxiaohu000002@sina.com ",
                "contact":"wangxiaohu000002@sina.com",
                "other":"",
                "sex":""
            },
            {
                "title":"跟三十岁说byebye的时候，期待着你的出现，for you my girl！",
                "info":"一直以来总是逛各种论坛，却没有勇气把帖子发出来。今天就下了狠心po出来。 马上要过31岁生日了，希望过生日前会脱单。。。。。。，以前只知道匆匆赶路却忘记欣赏沿途的风景，期待着一路有你同行，一同欣赏。 综述：先用一个词来描述自己“踏实” 基本信息：身高176cm，体重72kg，不是高富帅，但也还对得起观众，吉林人； 2012年1月北京二环外某高校硕士毕业后一直在北五环某央企科研院所任职。 我的性格：我是一个比较传统的男生，有着东北人直爽的性格，爱憎分明，做事爽快不拖泥带水，但自己有时候也会很碍于面子。自己属于技术宅的范畴，因此可能会少一些浪漫“细菌”。喜欢有逻辑性的东西，对感兴趣的东西特别专研，不喜欢“死性”的东西。自认为缺少文艺气息但是最近却喜欢上了“诗词大会”和“朗读者”。 我的生活：下班以后经常会去职工之家健身运动，平时喜欢游泳，偶尔打羽毛球，也喜欢到处走走，旅游欣赏沿途的风景（已经去过 西藏 云南 沿海各大城市，九寨沟、张家界之类的留着找个有缘人一起去吧）。 我的缺点：有的时候对一些事情太过于理想化；从小到大逢考“必怯场”，越在意的事情越紧张，以至于做个报告都紧张的不得了。 其他：父母性格随和，身体健康，退休在家搞点副业。承蒙父母勤俭持家，帮着在京北回龙观某个角落付了个首付。无奈人品不爆发六倍的概率仍没有中签。 希望您：简单传统一点的女生，低调理智，性格随和，知性大方，因为我不是“高富帅”所以也没理由要求你是“白富美”，但仅一条不要太胖，希望你不要比我大在87年-91年之间，感情经历简单，父母健康家庭和睦。 至于照片我们有缘互换吧，因为逛论坛的师兄弟姐妹和朋友太多就不在网上发了。 我是带着十分诚意来的，所以请放心我不是收简历的。 ",
                "contact":"pielove0313@126.com ",
                "other":"",
                "sex":""
            }
            ];

    }])
    .controller('mainController',['$scope',function($scope){
        console.log("mainController")
        $scope.click = function click(){
            window.location.href= "/timeline";
        }

        $scope.clickPie = function(){
            window.location.href= "/pielove";
        }
    }]);