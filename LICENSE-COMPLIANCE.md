# License Compliance Documentation

## Sri Nataraja Kalaniketan - Face Recognition Attendance Tracking System

### Project License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Open Source Dependencies and Their Licenses

This face recognition attendance tracking system utilizes several open-source libraries. The following section details the licenses for all major dependencies:

### 1. face-api.js

**Version:** 0.22.2
**License:** MIT License
**Repository:** [GitHub - justadudewhohacks/face-api.js](https://github.com/justadudewhohacks/face-api.js)
**Purpose:** JavaScript API for face detection and face recognition in the browser implemented on top of TensorFlow.js

**License Text Summary:**
- Commercial use: Allowed
- Modification: Allowed
- Distribution: Allowed
- Private use: Allowed
- Conditions: License and copyright notice must be included
- Limitations: No liability, No warranty

**Attribution:** Copyright (c) 2018 Vincent Mühler

---

### 2. TensorFlow.js (and related packages)

**Core Packages:**
- `@tensorflow/tfjs`: ^4.11.0
- `@tensorflow/tfjs-backend-webgl`: ^4.11.0

**License:** Apache License 2.0
**Repository:** [GitHub - tensorflow/tfjs](https://github.com/tensorflow/tfjs)
**Purpose:** Hardware-accelerated JavaScript library for training and deploying machine learning models in the browser

**License Text Summary:**
- Commercial use: Allowed
- Modification: Allowed
- Distribution: Allowed
- Private use: Allowed
- Conditions: License and copyright notice must be included, state changes
- Limitations: No liability, No warranty, Trademark use restrictions

**Attribution:** Copyright (c) 2020 The TensorFlow Authors

---

## Compliance Summary

The Sri Nataraja Kalaniketan Face Recognition Attendance System maintains full compliance with all open-source licenses used in the project:

1. **MIT License (Project & face-api.js):** Allows commercial and private use, modification, and distribution, provided copyright and license notices are preserved.

2. **Apache 2.0 License (TensorFlow.js):** Permissive license that allows commercial use and modification, requires license and copyright notices, and states any significant changes made to the code.

### License Compatibility

All licenses used in this project are compatible with each other:
- Both MIT and Apache 2.0 are permissive licenses
- Both allow commercial and private use
- Both allow modification and distribution
- The project's MIT license is compatible with the MIT-licensed face-api.js library
- Apache 2.0 (TensorFlow.js) is also compatible with MIT-licensed projects

---

## Attribution Requirements

When using or distributing this project, the following attribution must be provided:

```
Sri Nataraja Kalaniketan Face Recognition Attendance System
Copyright (c) 2025 clk7ai
Licensed under the MIT License

This project includes components from:
- face-api.js (MIT License)
- TensorFlow.js (Apache 2.0 License)
```

---

## Third-Party Libraries

For a complete list of all dependencies and their licenses, please refer to the `package.json` file and run:

```bash
npm audit
nnpm list
```

---

## Data Privacy and On-Premise Processing

The face recognition module processes all face data locally in the browser using face-api.js and TensorFlow.js. **No face data is transmitted to external servers or cloud services.** This ensures:

- User privacy is protected
- Compliance with data protection regulations
- No dependency on third-party face recognition APIs
- Full control over the recognition models and data

---

## Version Information

- **Project Version:** 0.1.0
- **face-api.js Version:** 0.22.2
- **TensorFlow.js Version:** 4.11.0+
- **TensorFlow.js WebGL Backend:** 4.11.0+
- **Last Updated:** 2025

---

## License Compliance Verification

To verify license compliance:

1. Review the [LICENSE](LICENSE) file for the main project license
2. Check individual package licenses in `node_modules` by reviewing their LICENSE files
3. Consult the [face-api.js LICENSE](https://github.com/justadudewhohacks/face-api.js/blob/master/LICENSE)
4. Consult the [TensorFlow.js LICENSE](https://github.com/tensorflow/tfjs/blob/master/LICENSE)

---

## Questions or Concerns

For any questions regarding licensing or compliance, please refer to:
- The MIT License definition: https://opensource.org/licenses/MIT
- The Apache 2.0 License definition: https://opensource.org/licenses/Apache-2.0
- GitHub's license information: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository
