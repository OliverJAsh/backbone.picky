describe("multi-select selectable interaction", function () {
    var Model = Backbone.Model.extend({
        initialize: function () {
            Backbone.Picky.Selectable.mixInto(this);
        }
    });

    var Collection = Backbone.Collection.extend({
        model: Model,

        initialize: function () {
            Backbone.Picky.MultiSelect.mixInto(this);
        }
    });

    describe("select / deselect the model directly", function () {

        describe("when 1 out of 2 models in a collection is selected", function () {
            var m1, m2, collection;

            beforeEach(function () {
                m1 = new Model();
                m2 = new Model();

                collection = new Collection([m1, m2]);
                spyOn(collection, "trigger").andCallThrough();

                m1.select();
            });

            it("should trigger 'some' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:some", collection);
            });

            it("should have a selected count of 1", function () {
                expect(collection.selectedLength).toBe(1);
            });

            it("should have the selected model in the selected list", function () {
                expect(collection.selected[m1.cid]).toBe(m1);
            });

            it("should not have the unselected model in the selected list", function () {
                expect(collection.selected[m2.cid]).toBeUndefined();
            });

        });

        describe("when 2 out of 2 models in a collection are selected", function () {
            var m1, m2, collection;

            beforeEach(function () {
                m1 = new Model();
                m2 = new Model();

                collection = new Collection([m1, m2]);
                spyOn(collection, "trigger").andCallThrough();

                m1.select();
                m2.select();
            });

            it("should trigger 'all' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:all", collection);
            });

            it("should have a selected count of 2", function () {
                expect(collection.selectedLength).toBe(2);
            });

            it("should have the first selected model in the selected list", function () {
                expect(collection.selected[m1.cid]).toBe(m1);
            });

            it("should have the second selected model in the selected list", function () {
                expect(collection.selected[m2.cid]).toBe(m2);
            });
        });

        describe("when a model is selected and then deselected", function () {
            var m1, collection;

            beforeEach(function () {
                m1 = new Model();

                collection = new Collection([m1]);
                m1.select();
                spyOn(collection, "trigger").andCallThrough();

                m1.deselect();
            });

            it("should trigger 'none' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:none", collection);
            });

            it("should have a selected count of 0", function () {
                expect(collection.selectedLength).toBe(0);
            });

            it("should not have the model in the selected list", function () {
                expect(collection.selected[m1.cid]).toBeUndefined();
            });
        });

        describe("when 1 out of 2 models in a collection is selected, and selecting the last one via the model's select", function () {
            var m1, m2, collection;

            beforeEach(function () {
                m1 = new Model();
                m2 = new Model();

                collection = new Collection([m1, m2]);
                m1.select();

                spyOn(collection, "trigger").andCallThrough();

                m2.select();
            });

            it("should trigger 'all' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:all", collection);
            });

            it("should have a selected count of 2", function () {
                expect(collection.selectedLength).toBe(2);
            });

            it("should have the first selected model in the selected list", function () {
                expect(collection.selected[m1.cid]).toBe(m1);
            });

            it("should have the second selected model in the selected list", function () {
                expect(collection.selected[m2.cid]).toBe(m2);
            });

        });

        describe("when all models are selected and deselecting one via the model's deselect", function () {
            var m1, m2, collection;

            beforeEach(function () {
                m1 = new Model();
                m2 = new Model();

                collection = new Collection([m1, m2]);
                m1.select();
                m2.select();

                spyOn(collection, "trigger").andCallThrough();

                m1.deselect();
            });

            it("should trigger 'some' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:some", collection);
            });

            it("should have a selected count of 1", function () {
                expect(collection.selectedLength).toBe(1);
            });

            it("should not have the first selected model in the selected list", function () {
                expect(collection.selected[m1.cid]).toBeUndefined();
            });

            it("should have the second selected model in the selected list", function () {
                expect(collection.selected[m2.cid]).toBe(m2);
            });

        });

        describe("when 1 out of 2 models in a collection is selected, and deselecting the last one via the model's deselect", function () {
            var m1, m2, collection;

            beforeEach(function () {
                m1 = new Model();
                m2 = new Model();

                collection = new Collection([m1, m2]);
                m1.select();

                spyOn(collection, "trigger").andCallThrough();

                m1.deselect();
            });

            it("should trigger 'none' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:none", collection);
            });

            it("should have a selected count of 0", function () {
                expect(collection.selectedLength).toBe(0);
            });

            it("should not have any models in the selected list", function () {
                var size = _.size(collection.selected);
                expect(size).toBe(0);
            });
        });

    });

    describe("select / deselect through the collection", function () {

        describe("when selecting a model through the collection's select method", function () {
            var m1, collection;

            beforeEach(function () {
                m1 = new Model();
                spyOn(m1, "select").andCallThrough();
                collection = new Collection([m1]);

                collection.select(m1);
            });

            it("should select the model", function () {
                expect(m1.select).toHaveBeenCalled();
            });
        });

        describe("when selecting a model which is not in the collection through the collection's select method", function () {
            var m1, collection;

            beforeEach(function () {
                m1 = new Model();
                spyOn(m1, "select").andCallThrough();
                collection = new Collection();

                collection.select(m1);
            });

            it("should select the model", function () {
                expect(m1.select).not.toHaveBeenCalled();
            });

            it("the model is not selected", function () {
                expect(m1.selected).toBeFalsy();
            });

            it("the selectedLength should be 0", function () {
                console.log(collection);
                expect(collection.selectedLength).toBe(0);
            });


        });

        describe("when deselecting a model through the collection's select method", function () {
            var m1, collection;

            beforeEach(function () {
                m1 = new Model();
                spyOn(m1, "deselect").andCallThrough();

                collection = new Collection([m1]);
                m1.select();

                collection.deselect(m1);
            });

            it("should deselect the model", function () {
                expect(m1.deselect).toHaveBeenCalled();
            });
        });

        describe("when 1 out of 2 models in a collection is selected, and selecting the last one via the collection's select", function () {
            var m1, m2, collection;

            beforeEach(function () {
                m1 = new Model();
                m2 = new Model();

                collection = new Collection([m1, m2]);
                collection.select(m1);

                spyOn(collection, "trigger").andCallThrough();

                collection.select(m2);
            });

            it("should trigger 'all' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:all", collection);
            });

            it("should have a selected count of 2", function () {
                expect(collection.selectedLength).toBe(2);
            });

            it("should have the first selected model in the selected list", function () {
                expect(collection.selected[m1.cid]).toBe(m1);
            });

            it("should have the second selected model in the selected list", function () {
                expect(collection.selected[m2.cid]).toBe(m2);
            });

        });

        describe("when all models are selected and deselecting one via the collection's deselect", function () {
            var m1, m2, collection;

            beforeEach(function () {
                m1 = new Model();
                m2 = new Model();

                collection = new Collection([m1, m2]);
                collection.select(m1);
                collection.select(m2);

                spyOn(collection, "trigger").andCallThrough();

                collection.deselect(m1);
            });

            it("should trigger 'some' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:some", collection);
            });

            it("should have a selected count of 1", function () {
                expect(collection.selectedLength).toBe(1);
            });

            it("should not have the first selected model in the selected list", function () {
                expect(collection.selected[m1.cid]).toBeUndefined();
            });

            it("should have the second selected model in the selected list", function () {
                expect(collection.selected[m2.cid]).toBe(m2);
            });

        });

        describe("when 1 out of 2 models in a collection is selected, and deselecting the last one via the collection's deselect", function () {
            var m1, m2, collection;

            beforeEach(function () {
                m1 = new Model();
                m2 = new Model();

                collection = new Collection([m1, m2]);
                collection.select(m1);

                spyOn(collection, "trigger").andCallThrough();

                collection.deselect(m1);
            });

            it("should trigger 'none' selected event", function () {
                expect(collection.trigger).toHaveBeenCalledWith("collection:selected:none", collection);
            });

            it("should have a selected count of 0", function () {
                expect(collection.selectedLength).toBe(0);
            });

            it("should not have any models in the selected list", function () {
                var size = _.size(collection.selected);
                expect(size).toBe(0);
            });
        });

    });

    describe("update a collection using refreshSelection no models selected", function () {
        var m1, m2, m3, collection;

        beforeEach(function () {
            m1 = new Model();
            m2 = new Model();
            m3 = new Model();

            collection = new Collection();

            spyOn(collection, "trigger").andCallThrough();

            collection.add([m1, m2, m3]);
            collection.refreshSelection();
        });

        it("should trigger `selected:none` event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:selected:none", collection);
        });

    });

    describe("update a collection using refreshSelection no models selected", function () {
        var m1, m2, m3, collection;

        beforeEach(function () {
            m1 = new Model();
            m2 = new Model();
            m3 = new Model();
            m1.select();

            collection = new Collection();

            spyOn(collection, "trigger").andCallThrough();

            collection.add([m1, m2, m3]);
            collection.refreshSelection();
        });

        it("should trigger `collection:selected:some` event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:selected:some", collection);
        });

        it("should have m1 selected in the collection", function () {
            expect(collection.selected[m1.cid]).toBe(m1);
        });

    });

    describe("update a collection using refreshSelection no models selected", function () {
        var m1, m2, m3, collection;

        beforeEach(function () {
            m1 = new Model();
            m2 = new Model();
            m3 = new Model();
            m1.select();
            m2.select();
            m3.select();

            collection = new Collection();

            spyOn(collection, "trigger").andCallThrough();

            collection.add([m1, m2, m3]);
            collection.refreshSelection();
        });

        it("should trigger `collection:selected:all` event", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:selected:all", collection);
        });

        it("should have all models selected in the collection", function () {
            expect(collection.selected[m1.cid]).toBe(m1);
            expect(collection.selected[m2.cid]).toBe(m2);
            expect(collection.selected[m3.cid]).toBe(m3);
        });

    });

    describe("get all the selected models from a collection", function () {
        var m1, m2, m3, collection, selectedModels;

        beforeEach(function () {
            m1 = new Model();
            m2 = new Model();
            m3 = new Model();

            collection = new Collection();
            collection.add([m1, m2, m3]);
            m1.select();
            m3.select();

            selectedModels = collection.getSelected();
        });

        it("selected models should contain only m1 and m3", function () {
            expect(selectedModels.length).toBe(2);
            expect(selectedModels[0]).toBe(m1);
            expect(selectedModels[1]).toBe(m3);
        });

    });

    describe("when the collection is reset", function () {
        var m1, m2, m3, collection, selectedModels;

        beforeEach(function () {
            m1 = new Model();
            m2 = new Model();
            m3 = new Model();

            m1.select();
            
            collection = new Collection([m1, m2, m3]);
            spyOn(collection, "trigger").andCallThrough();
            collection.trigger("reset",collection);
        });

        it("m1 should be selected", function () {
            expect(collection.selected[m1.cid]).toBe(m1);
            expect(m1.selected).toBeTruthy();
        });

        it("selection event should be triggered", function () {
            expect(collection.trigger).toHaveBeenCalledWith("collection:selected:some", collection);
        });

    });

});
