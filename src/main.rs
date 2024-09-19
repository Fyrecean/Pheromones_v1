use rocket::fs::{relative, FileServer, Options};

#[rocket::launch]
fn rocket() -> _ {
    rocket::build()
    .mount("/", FileServer::new(relative!("client/public"), Options::default()).rank(1))
    .mount("/src", FileServer::new(relative!("client/src"), Options::default()))
}
