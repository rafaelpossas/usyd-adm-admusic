global.config = require('../config/config')["test"];
var mng = require('../config/mongoose.js');

var chai = require('chai');
var expect = chai.expect;
var superagent = require('superagent');
var Artist = require("../models/Artist");
var User = require("../models/User");

describe("Artist",function(){

    before(function (done) {
        this.timeout(10000);
        mng(global.config.db,true)
            .then(function(){
                done();
            })
    });

    describe.only("The code",function(){
        it("should transform an array into a string",function(){
            var artists = [1,2,3,4];
            var artistsString = Artist.schema.methods.getArtistsStringByArray(artists);
            expect(artistsString).to.equal("'1','2','3','4'");
        });
    });
    describe("The  database",function(){

        it("should return an artist by id",function(done){
            var promise = Artist.schema.methods.getArtistMDB(1);
            promise
                .then(function(data){
                    try{
                        expect(data._id).to.equal(1);
                        done();
                    }catch(e){
                        done(e);
                    }
                },function(err){
                    done(err);
                })

        });
        it("should let the user listen to an specific artist",function(done){
            var promise = User.model.findOne({_id:1}).exec();
            promise
                .then(function(res){
                     return res.schema.methods.listen(res,{_id: 10});
                }).then(function(res){
                    try{
                        expect(res.artists[0].count).to.equal(13884);
                        done();
                    }catch (e){
                        done(e);
                    }

                },function(err){
                    done(err);
                });
        });
        it("should return an artist by id",function(done){
            var promise = Artist.schema.methods.getArtistN4J(1);
            promise
                .then(function(res){
                    try{
                        expect(res.body.results[0].data[0].row[0].id).to.equal('1');
                        done();
                    }catch (e){
                        done(e);
                    }
                });
        });
        it("should make 5 recommendations of artists that may interest a user ordered by the sum of friends listening counts (MongoDB)",function(done){
            var promise = Artist.schema.methods.recomendTopFiveArtistsByFriendsListeningCountMongoDB(1);
            promise
                .then(function(data){
                    try{
                        expect(data.length).to.equal(5);
                        done();
                    }catch (e){
                        done(e);
                    }

                },function(error){
                    done(err);
                });

        });
        it("should make 5 recommendations of artists that may interest a user ordered by the sum of friends listening counts (Neo4j)",function(done){
            var promise = Artist.schema.methods.recomendTopFiveArtistsByFriendsListeningCountNeo4j(1);
            promise
                .then(function(data){
                    expect(data.length).to.equal(5)
                    done();
                },function(error){
                    done(error);
                });

        });
        it("should make 5 recommendations of artists that may interest a user ordered by the sum of friends listening counts (Polyglot)",function(done){
           var promise = Artist.schema.methods.recomendTopFiveArtistsByFriendsListeningCountPolyglot(1);
            promise
                .then(function(data){
                    try{
                        expect(data.length).to.equal(5)
                        done();
                    }catch (e){
                        done(e);
                    }
                },function(error){
                    done(error);
                });

        });
        it("should make 5 recommendations of artists that may interest a user ordered by the sum of friends counts (MongoDB)",function(done){
            var promise = Artist.schema.methods.recomendTopFiveArtistsByFriendsCountMongoDB(1);
            promise
                .then(function(data){
                    try{
                        expect(data.length).to.equal(5);
                        done();
                    }catch (e){
                        done(e);
                    }

                },function(error){
                    done(error);
                });

        });
        it("should make 5 recommendations of artists that may interest a user ordered by the sum of friends counts (Neo4j)",function(done){
            var promise = Artist.schema.methods.recomendTopFiveArtistsByFriendsCountNeo4j(1);
            promise
                .then(function(data){
                    try{
                        expect(data.length).to.equal(5);
                        done();
                    }catch (e){
                        done(e);
                    }

                },function(error){
                    done(error);
                });

        });
        it("should make 5 recommendations of artists that may interest a user ordered by the sum of friends counts (Polyglot)",function(done){
            var promise = Artist.schema.methods.recomendTopFiveArtistsByFriendsCountPolyglot(1);
            promise
                .then(function(data){
                    try{
                        console.log(data);
                        expect(data.length).to.equal(5);
                        done();
                    }catch (e){
                        done(e);
                    }

                },function(error){
                    done(error);
                });

        });
        it.only("should make 5 recommendations of artists by using a random tag",function(done){
            var promise = Artist.schema.methods.recommendByTag(1);
            promise
                .then(function(data){
                   console.log(data);
                    done();
                },function(err){
                    console.log(err);
                    done(err);
                });

        });
    });

    describe("The application",function(){

        it("should allow a user to query and browse the basic information about any artist",function(done){
            superagent
                .get("http://localhost:3000/artists/1")
                .end(function(err,res){
                    try{
                        expect(err).to.be.null;
                        expect(res.status).to.equal(200);
                        expect(res.body._id).to.equal(1);
                        done();
                    } catch (e){
                        done(e);
                    }


                })
        });

        it("should allow a user to listen to musics of any artist, the system keeps track of the listening count per user per artist",function(done){
            superagent
                .post("http://localhost:3000/artists/1/listen")
                .send({user:1})
                .end(function(err,res){
                    try{
                        expect(err).to.be.null;
                        expect(res.status).to.equal(200);
                        expect(res.body._id).to.equal(1);
                        done();
                    } catch (e){
                        done(e);
                    }


                })
        });
    });
});