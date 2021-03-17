db.schema.hasTable("private_messages").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("private_messages", function (t) {
      t.increments("id").primary();
      t.string("sender", 100);
      t.string("receiver", 100);
      t.string("text");
      t.string("chatid");
      t.string("accepted_by");
      t.string("seen_by");
      t.timestamp("created_at").defaultTo(db.fn.now());
    });
  }
});

db.schema.hasTable("group_info").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("group_info", function (t) {
      t.string("groupid");
      t.string("group_name");
      t.string("member");
      t.boolean("is_admin");
      t.timestamp("in_date").defaultTo(db.fn.now());
      t.timestamp("left_date").nullable().defaultTo(null);
    });
  }
});
db.schema.hasTable("all_groups").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("all_groups", function (t) {
      t.string("groupid");
      t.string("group_name");
      t.string("member");
      t.string("admins");
      t.timestamp("created").defaultTo(db.fn.now());
    });
  }
});
db.schema.hasTable("user_chat").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("user_chat", function (t) {
      t.string("username");
      t.string("receiverName");
      t.timestamp("last_updated");
      t.string("type");
      t.string("groupid").nullable();
    });
  }
});
db.schema.hasTable("group_chat").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("group_chat", function (t) {
      t.increments("id").primary();
      t.string("groupid");
      t.string("chatid");
      t.string("sender").nullable();
      t.string("text");
      t.string("type");
      t.dateTime("created").defaultTo(db.fn.now());
      t.string("seen_by");
      t.string("accepted_by");
    });
  }
});
db.schema.hasTable("socketids").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("socketids", (t) => {
      t.string("name");
      t.string("id");
    });
  }
});
